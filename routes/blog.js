const {Router} = require('express');


const router = new Router();

// home page 
router.get('/', (req, res) => {
    res.render('index', {
        pageTitle: 'وبلاگ من',
        path: '/'
    });
})

module.exports = router