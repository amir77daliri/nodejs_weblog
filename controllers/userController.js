const passport = require('passport');

const User = require('../models/User');


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
    res.redirect("/users/login");
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