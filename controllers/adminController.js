const fs = require('fs');

const multer = require('multer');
const sharp = require('sharp');
const shortId = require('shortid');
const appRoot = require('app-root-path');

const Blog = require('../models/Blog');
const { formatDate } = require('../utils/jalali');
const { get500 } = require('./errorController');
const {storage, fileFilter} = require('../utils/multer');

// dashboard page
exports.getDashboard = async(req, res) => {
    let page = +req.query.page || 1;
    const postPerPage = 4;
    try {
        const numOfPosts = await Blog.find({user: req.user.id}).countDocuments();
        if(postPerPage * page > numOfPosts) {
            page = Math.ceil( numOfPosts / postPerPage )
            if(page === 0) {page=1}
        } 
        const blogs = await Blog.find({ user: req.user.id })
              .skip((page - 1) * postPerPage)
              .limit(postPerPage);
        res.render('./private/blogs', {
            pageTitle: "مدیریت | داشبورد",
            path: "/dashboard",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            blogs,
            formatDate,
            currentPage: page,
            nextPage: page + 1,
            prevPage: page - 1,
            hasNextPage: postPerPage * page < numOfPosts ,
            hasPrevPage: page > 1,
            lastPage: Math.ceil( numOfPosts / postPerPage )
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
    let errors = [];
    const thumbnail = req.files ? req.files.thumbnail : {} ;
    const fileName = `${shortId.generate()}_${thumbnail.name}`;
    const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;

    try {
        req.body = {...req.body, thumbnail};
        await Blog.postValidation(req.body);
        await sharp(thumbnail.data).jpeg({quality: 70}).toFile(uploadPath).catch(err => console.log(err))
        await Blog.create({... req.body, user: req.user.id, thumbnail: fileName});
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
    const thumbnail = req.files ? req.files.thumbnail : {} ;
    const fileName = `${shortId.generate()}_${thumbnail.name}`;
    const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;

    try {
        if(thumbnail.name) {
            await Blog.postValidation({...req.body, thumbnail});
        } else {
            await Blog.postValidation({...req.body, thumbnail: {name: 'placeholder', size: 0, mimeType: 'image/jpeg'}})
        }
        if(!post) {
            return res.redirect("errors/404");
        }
        if(post.user.toString() != req.user._id) {
            return res.redirect('/dashboard');
        } else {
            if(thumbnail.name) {
                fs.unlink(`${appRoot}/public/uploads/thumbnails/${post.thumbnail}`, 
                    async (err) => {
                        if(err) { console.log(err) }
                        else {
                            await sharp(thumbnail.data)
                                    .jpeg({quality: 70})
                                    .toFile(uploadPath)
                                    .catch(err => console.log(err))
                                }
                            });
                        }
            
            const {title, status, body} = req.body;
            post.title = title;
            post.status = status;
            post.body = body;
            post.thumbnail = thumbnail.name ? fileName : post.thumbnail
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