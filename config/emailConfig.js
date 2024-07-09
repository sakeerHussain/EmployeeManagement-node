const nodeMailer = require("nodemailer");
const dotenv = require("dotenv").config();

//configure email
const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
});

// OTP_configure_mail
const sendOTP = async(email, otp) =>{
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP for verification is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent sucessfully');
    } catch (error) {
        console.error("Error in sending OTP email:",error);
        throw new Error('Error sending OTP email');
    }
}







module.exports = { transporter, sendOTP };