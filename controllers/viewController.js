const path = require("path");

exports.renderHome = (req,res) =>{
    res.render('pages/index');
}

exports.renderViewDetails =  (req, res) =>{
    res.render('pages/viewDetails');
}

exports.renderSignup = (req, res) =>{
    res.render('pages/signUp');
}

exports.renderLogin = (req, res) =>{
    res.render('pages/logIn');
}

exports.renderVerifyOTP = (req, res) =>{
    res.render('pages/verifyOTP');
}