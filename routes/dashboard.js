const { Router } = require("express");
const { authenticated } = require('../middleware/auth');

const adminController = require('../controllers/adminController');
const router = new Router();

// dashboard route
router.get('/', authenticated, adminController.getDashboard)

// add new post route
router.get('/add-post', authenticated, adminController.getAddPost);

// add post handle route
router.post('/add-post', authenticated, adminController.createPost);

// handle image uploading
router.post('/image-upload', authenticated, adminController.uploadImage);

module.exports = router;
