const Blog = require('../models/Blog');


// dashboard page
exports.getDashboard = async(req, res) => {
    res.render('./private/blogs', {
        pageTitle: "مدیریت | داشبورد",
        path: "/dashboard",
        layout: "./layouts/dashLayout",
        fullname: req.user.fullname
    })
}


// add-post page
exports.getAddPost = (req, res) => {
    res.render("./private/addPost", {
        pageTitle: "مدیریت | پست جدید",
        path: "/dashboard/add-post",
        layout: "./layouts/dashLayout",
        fullname: req.user.fullname
    })
}


// create new post 
exports.createPost = async (req, res) => {
    try {
        await Blog.create({... req.body, user: req.user.id});
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err);
    }
}