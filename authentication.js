const session =require("express-session");

const sessionMid = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 7 * 60 * 60 * 1000,
    },
});

const isAuth = (req, res, next) =>{
    if( req.session.isAuth ){
        return next();
    } else {
        return res.redirect("/login");
    }
};


module.exports = { isAuth , sessionMid };