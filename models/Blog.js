const mongoose = require('mongoose');

const postValidationsSchema = require('../utils/validations/postValidation');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 100
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "public",
        enum: ["public", "private"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

blogSchema.statics.postValidation = function(body) {
    return postValidationsSchema.validate(body, {abortEarly: false});
}

module.exports = mongoose.model("Blog", blogSchema);