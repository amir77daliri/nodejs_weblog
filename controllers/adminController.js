const multer = require('multer');
const sharp = require('sharp');
const shortId = require('shortid');

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
            if(err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).send("حجم عکس ارسالی نباید بیشتر از 4 مگابایت باشد")
            }
            res.status(400).send(err)
        } else{
            if(req.file) {
                const fileName = `${shortId.generate()}_${req.file.originalname}`;
                await sharp(req.file.buffer).jpeg({
                    quality: 60
                })
                .toFile(`./public/uploads/${fileName}`)
                .catch(err => console.log(err));
                return res.status(200).send(`http://localhost:3000/public/uploads/${fileName}`);
            }
            res.send("برای آپلود عکسی انتخلب کنید...")
        }
    })
}


//? edit post view :
exports.getEditPost = async (req, res) => {
    try {
        const post = await Blog.findOne({
            _id : req.params.id
        })
        if(post.user.toString() != req.user._id) {
            return res.redirect('/dashboard')
        }
        res.render("private/editPost", {
            pageTitle: "مدیریت |  ویرایش پست",
            path: "/dashboard/edit-post",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            post
        })

    } catch (err) {
        return res.redirect('/errors/404');
    }
}


// handle edit post :
exports.editPost = async (req, res) => {
    let errors = [];
    const post = await Blog.findOne({_id: req.params.id});
    try {
        await Blog.postValidation(req.body);
        if(!post) {
            return res.redirect("errors/404");
        }
        if(post.user.toString() != req.user._id) {
            return res.redirect('/dashboard');
        } else {
            const {title, status, body} = req.body;
            post.title = title;
            post.status = status;
            post.body = body;
            await post.save();
            return res.redirect('/dashboard');
        }
    } catch (err) {
        err.inner.forEach(e => {
            errors.push({
                name: e.path,
                message: e.message
            })
        })
        res.render("private/editPost", {
            pageTitle: "مدیریت | ویرایش پست",
            path: "/dashboard/edit-post",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            errors,
            post
        })
    }
}


//? delete post 
exports.deletePost = async (req, res) => {
    try {
        const result = await Blog.findByIdAndRemove(req.params.id)
        res.redirect('/dashboard')
    } catch (err) {
        res.render('errors/500');
    }
}