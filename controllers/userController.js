const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const { transporter, sendOTP } = require("../config/emailConfig");

/* @desc Register/signUp a user
   @routes POST /api/user/register
   @access public*/

const signupUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  if (!username || !email || !password) {
    console.error('Missing fields:', { username, email, password });
    // res.status(400);
    // throw new Error("All fields are mandatory!");
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  // checking if the user is already registerd
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    return res.status(200).json({ message: "User alreday exists. Change the email." })
    // res.render('pages/signup',{alreadyExists:"User alreday exists. Change the email."});
   } else{
      // password hashing.........
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate OTP
   const otp = Math.floor(100000 + Math.random() * 900000).toString(); //6digit OTP
   const otpExpiration = Date.now() + 2 * 60 * 1000; //2minutes
 
   // save OTP and Session
   req.session.signUpData = {
     username,
     email,
     password: hashedPassword,
     generateOTP: otp,
     otpExpiration,
   };
   console.log("Genetated OTP:", otp); 
   console.log("Session data:", req.session.signUpData);
 
   // send oTP to the user
   sendOTP(email, otp);
   return res.status(200).json({message:"otp is send via mail" , redirect:"/verifyOTP"});
  //  return res.redirect('/verifyOTP');
   }
});

/* @desc verify OTP
   @routes POST /api/user/verifyOTP*/
const verifyOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  console.log("Received OTP:", otp);
  console.log("session data at verification:", req.session.signUpData);

  if (!req.session.signUpData) {
    console.log("No session data available");
    return res.render("/verifyOTP", { error: "Signup data not found. please try again."});
  }
  const { username, email, password, generateOTP, otpExpiration } =
    req.session.signUpData;
  console.log("Generated Otp from session:", generateOTP);

  if (Date.now() > otpExpiration) {
    console.log("Session expired");
    delete req.session.signUpData;
    // return res.render("/verifyOTP",{otpMismatch:"OTP has expired. please request a new one."});
    return res.status(400).json({ otpMismatch: "OTP has expired.Please try again." });
  }

  if (otp === generateOTP) {
    //user verified, add the user into the database
    console.log("saved");
    const userdata = await User.create({
      username,
      email,
      password,
    });

    delete req.session.signUpData;
    console.log(userdata);
    // return res.redirect("/login")
    return res.status(200).json({ message: "register successfully", redirect: "/login" });
  } else {
    // return res.render('/verifyOTP',{error: "Incorrect OTP. Please try again."})
    return res.status(200).json({error: "Incorrect OTP.Please try again.",});
  }
});

// @desc Login a user
// @routes POST /api/userd/login
//@access public

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(req.body);
  console.log("Email received:", email);

  if (!email || !password) {
    console.log("missing fields:", { email, password });
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ emailNotFound: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      req.session.isAuth = true;
      console.log("success...");
      return res.status(200).json({ message: "Login successfully", redirect: "/home" });
    } else {
      console.log("Wrong password");
      return res.status(401).render({ wrongPassword: "Wrong password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return next(error); // Pass the error to the error handling middleware
  }
});



// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
// console.log(req.body);
//   console.log("Email recevied:", email);

//   if (!email || !password) {
//     console.log('missing fields:',{ email, password});
//     return res.status(400).json({ message: "All fields are mandatory" });
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       // return res.status(404).json({ message: "User not found" });
//       return res.status(404).render('/login',{ emailNotFound: "User not found"}); 
//     }
//     const isPasswordMatch = await bcrypt.compare(password, user.password);

//     if (isPasswordMatch) {
//       req.session.isAuth = true;
//       console.log("success...");
//       return res.redirect("/index");
//     } else {

//       return res.status(400).render('/login', {wrongPassword: "Wrong password"});    //, redirect: "/logIn" 
//     }
//   } catch (error) {
//     console.error("Error during login:", error);
//     return res.status(500).json({ message: "Error during login" });
//   }
// });


/*@desc Logout a user*/

const logoutUser = asyncHandler(async (req, res) =>{
  console.log("Befor destroying session:", req.sessionID);
  req.session.destroy((err) =>{
    if(err){
      console.error(err);
      res.status(500).json({ message: "Internal server Error"});
    } else{
      console.log("After destroying session:" ,req.sessionID);
      res.clearCookie("connect.sid");
      res.redirect("/login");
    }
  });
});

module.exports = { signupUser, loginUser, verifyOTP ,logoutUser};
