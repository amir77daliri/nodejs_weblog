const { Router } = require("express");
const { authenticated } = require('../middleware/auth');

const router = new Router();

// dashboard page
router.get('/', authenticated, (req, res) => {

    res.render('dashboard', {
        pageTitle: "مدیریت وبلاگ من",
        path: '/dashboard',
        layout: './layouts/dashLayout',
        fullname: req.user.fullname
    })
})


module.exports = router;
