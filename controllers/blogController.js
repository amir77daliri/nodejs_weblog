const Blog = require('../models/Blog');
const { formatDate } = require('../utils/jalali');
const { truncate } = require('../utils/helpers');

exports.getIndex = async (req, res) => {
    let page = +req.query.page || 1;
    const postPerPage = 4;
    try {
        const numOfPosts = await Blog.find().countDocuments();
        if(postPerPage * page > numOfPosts) {
            page = Math.ceil( numOfPosts / postPerPage )
        } 
        const posts = await Blog
                            .find({status : 'public'})
                            .sort({createdAt: 'desc'})
                            .skip((page - 1) * postPerPage)
                            .limit(postPerPage);   
        res.render('index', {
            pageTitle: 'وبلاگ من',
            path: '/',
            posts,
            formatDate,
            truncate,
            currentPage: page,
            nextPage: page + 1,
            prevPage: page - 1,
            hasNextPage: postPerPage * page < numOfPosts ,
            hasPrevPage: page > 1,
            lastPage: Math.ceil( numOfPosts / postPerPage )
        });
    } catch (err) {
        res.render('errors/500');
    }
}


exports.getPostDetail = async (req, res) => {
    try {
        const post = await Blog.findOne({_id: req.params.id}).populate("user")
        if(!post) {
            return res.render('errors/404')
        }
        res.render('postDetail', {
            pageTitle: post.title,
            path: '/post-detail',
            post,
            formatDate
        })
    } catch (err) {
        res.render('errors/500')
    }
}