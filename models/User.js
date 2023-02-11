const mongoose = require('mongoose');

const validateSchema = require('../utils/validations/userValidateSchema');

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
    return validateSchema.validate(body, {abortEarly: false})
}

const User = mongoose.model("User", userSchema);

module.exports = User;