const multer = require('multer');
const {v4: uuid} = require('uuid');
const sharp = require('sharp');

const Blog = require('../models/Blog');
const { formatDate } = require('../utils/jalali');
const { get500 } = require('./errorController');
const {storage, fileFilter} = require('../utils/multer');

// dashboard page
exports.getDashboard = async(req, res) => {
    try {
        const blogs = await Blog.find({ user: req.user.id });
        res.render('./private/blogs', {
            pageTitle: "مدیریت | داشبورد",
            path: "/dashboard",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            blogs,
            formatDate
        })
    } catch (err) {
        get500(req, res);
    }
    
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


// create post handle
exports.createPost = async (req, res) => {
    let errors = []
    try {
        await Blog.postValidation(req.body);
        await Blog.create({... req.body, user: req.user.id});
        res.redirect('/dashboard')
    } catch (err) {
        err.inner.forEach(e => {
            errors.push({
                name: e.path,
                message: e.message
            })
        })
        res.render("./private/addPost", {
            pageTitle: "مدیریت | پست جدید",
            path: "/dashboard/add-post",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            errors
        })
    }
}


// control image upload
exports.uploadImage = (req, res) => {
    // let fileName = `${uuid()}.jpg`;
    const upload = multer({
        limits: {fileSize: 5000000},
        //dest: "uploads/",
        //storage,
        fileFilter
    }).single("image")
    
    upload(req, res, async (err) => {
        if(err) {
            res.send(err)
        } else{
            if(req.file) {
                console.log(req.file);
                const fileName = `${uuid()}_${req.file.originalname}`;
                await sharp(req.file.buffer).jpeg({
                    quality: 60
                })
                .toFile(`./public/uploads/${fileName}`)
                .catch(err => console.log(err));
                return res.status(200).send("آپلود عکس موفقیت آمیز بود");
            }
            res.send("برای آپلود عکسی انتخلب کنید...")
        }
    })
}