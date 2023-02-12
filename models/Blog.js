const mongoose = require('mongoose');


const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 300
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "عمومی",
        enum: ["عمومی", "خصوصی"]
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


module.exports = mongoose.model("Blog", blogSchema);