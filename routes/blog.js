const {Router} = require('express');

const { getIndex, getPostDetail } = require('../controllers/blogController');

const router = new Router();

// home page 
router.get('/', getIndex);

// post detail page
router.get('/blogs/:id', getPostDetail)

module.exports = router