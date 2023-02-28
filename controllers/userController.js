const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { sendEmail } = require('../utils/mailer');
const { get500 } = require('./errorController');

exports.login = (req, res) => {
    res.render("login", { 
        pageTitle: "ورود به بخش مدیریت",
        path: "/login",
        message: req.flash("success_msg"),
        error: req.flash("error") 
    });
}


exports.handleLogin = (req, res, next) => {
    passport.authenticate("local", {
        // successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true,
    })(req, res, next);
}

exports.rememberMe = (req, res) => {
    if(req.body.rememberMe){
        req.session.cookie.originalMaxAge = 7 * 24 * 60 * 60 * 1000;
    } else {
        req.session.cookie.expire = null;
    }
    res.redirect('/dashboard')
}


exports.logout = (req, res) => {
    req.session = null;
    // req.flash("success_msg", "خروج موفقیت آمیز بود");
    req.logout(err => {return;});
    res.redirect("/");
}

exports.register = (req, res) => {
    res.render("register", { 
        pageTitle: "ثبت نام کاربر",
        path: "/register" 
    })
}


// create new user
exports.createUser = async (req, res) => {
    const errors = [];
    try {
        await User.userValidation(req.body);
        const {fullname, email, password} = req.body
        const user = await User.findOne({email});
        if(user) { 
            errors.push({'message': "کاربری با این ایمیل موجود است!"});
            return res.render("register", {
                pageTitle: "ثبت نام کاربر",
                path: "/register", 
                errors
            }) 
        }
        //const hash = await bcrypt.hash(password, 10)
        await User.create({fullname, email, password});

        //? send Welcome Email :
        // sendEmail(email, fullname, "ثبت نام موفق", "ثبت نام شما موفقیت آمیز بود. خوش آمدید")

        req.flash("success_msg", "ثبت نام موفقیت آمیز بود");
        res.redirect('/users/login');
    } catch (err) {
        err.inner.forEach(e => {
            errors.push({
                name: e.path,
                message: e.message
            })
        })
        return res.render("register", {
            pageTitle: "ثبت نام کاربر",
            path: "/register", 
            errors
        })
    }
}


//? forget password controllers --> 
exports.forgetPassword = (req, res) => {
    res.render('forgetPass', {
        pageTitle: "فراموشی رمز عبور",
        path: '/login',
        message: req.flash("success_msg"),
        error: req.flash("error")
    })
}


//? handle forget pass
exports.handleForgetPassword = async (req, res) => {
    const {email} = req.body
    try {
        const user = await User.findOne({email: email});
        if(!user) {
            req.flash("error", "کاربری با این ایمیل یافت نشد!");
            return res.redirect("/users/forget-password");
        }
        
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "0.5h"});
        const resetLink = `http://localhost:3000/users/reset-password/${token}`;
        console.log(resetLink);
        
        sendEmail(
            email, 
            user.fullname,
            "فراموشی رمز عبور", 
            `جهت تغییر رمز عبور روی لینک فعلی کلیک کنید <a href="${resetLink}">بازیابی رمز عبور</a>`
            , )
        req.flash("success_msg", "ایمیل حاوی لینک بازیابی رمز برای شما ارسال شد.")
        return res.redirect('/users/forget-password');

    } catch (error) {
        get500(re, res)
    }
}


// ? reset pass page
exports.getResetPass = async (req, res) => {
    const token = req.params.token;
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        console.log(err);
        if(!decodedToken) {
            return res.redirect('/404');
        }
    }

    res.render('resetPass', {
        pageTitle: "بازیابی رمز عبور",
        path: '/login',
        message: req.flash("success_msg"),
        error: req.flash("error"),
        userId: decodedToken.userId
    })
}


// set new password
exports.setNewPassword = async (req, res) => {
    const {password, confirmPassword} = req.body;
    if(password !== confirmPassword) {
        req.flash("error", "کلمه های عبور یکسان نیستند.");
        return res.render('resetPass', {
            pageTitle: "بازیابی رمز عبور",
            path: '/login',
            message: req.flash("success_msg"),
            error: req.flash("error"),
            userId: req.params.id
        })
    }
    try {
        const user = await User.findOne({ _id: req.params.id});
        if(!user) {
            return res.redirect('/404')
        }
        user.password = password;
        await user.save();
        req.flash("success_msg", "رمز عبور با موفقیت تغییر کرد");
        res.redirect('/users/login');
    } catch (err) {
        get500(req, res);
    }
}