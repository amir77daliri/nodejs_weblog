const { Router } = require("express");
const { authenticated } = require('../middleware/auth');

const adminController = require('../controllers/adminController');
const router = new Router();

// dashboard route
router.get('/', authenticated, adminController.getDashboard)

// add new post route
router.get('/add-post', authenticated, adminController.getAddPost);

// edit post route
router.get('/edit-post/:id', authenticated, adminController.getEditPost);

// delete post route
router.get('/delete-post/:id', authenticated, adminController.deletePost);

// add post handling route
router.post('/add-post', authenticated, adminController.createPost);

// edit post handling route
router.post('/edit-post/:id', authenticated, adminController.editPost);

// handle image uploading
router.post('/image-upload', authenticated, adminController.uploadImage);

module.exports = router;
