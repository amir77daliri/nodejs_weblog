const {Router} = require('express');

const User = require('../models/User');


const router = new Router();


// login page
router.get("/login", (req, res) => {
    res.render("login", { 
        pageTitle: "ورود به بخش مدیریت",
        path: "/login" 
    });
});

// register page
router.get("/register", (req, res) => {
    res.render("register", { 
        pageTitle: "ثبت نام کاربر",
        path: "/register" 
    });
});


// handle register user
router.post("/register", async (req, res) => {
    try {
        await User.userValidation(req.body);
        res.redirect('/users/login');
    } catch (err) {
        console.log(err);
        const errors = [];
        err.inner.forEach(e => {
            errors.push({
                name: e.path,
                message: e.message
            })
        })
        res.render("register", {
            pageTitle: "ثبت نام کاربر",
            path: "/register", 
            errors
        })
    }
})


module.exports = router;