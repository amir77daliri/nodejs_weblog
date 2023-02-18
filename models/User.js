const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userValidationSchema = require('../utils/validations/userValidateSchema');


const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 255
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.statics.userValidation = function(body) {
    return userValidationSchema.validate(body, {abortEarly: false})
}

userSchema.pre("save", async function(next) {
    let user = this;
    if(!user.isModified('password')) return next();
    try {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
        next();
    } catch (err) {
        return next(err);
    }
})


module.exports = mongoose.model("User", userSchema);;