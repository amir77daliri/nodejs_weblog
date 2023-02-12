const bcrypt = require('bcryptjs');
const passport = require('passport');
const { Strategy } = require('passport-local');

const User = require('../models/User');


passport.use(new Strategy({usernameField: "email"}, async (email, password, done) => {
    try {
        const user = await User.findOne({email});
        if(!user) {
            return done(null, false, {message: "کاربری با این ایمیل یافت نشد!"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch) {
            return done(null, user); // awailable in req.user
        }
        return done(null, false, {message: "نام کاربری یا رمز عبور اشتباه است!"});
    } catch (error) {
        console.log(error);
    }
}))


passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})