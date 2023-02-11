const { Router } = require("express");

const router = new Router();

// dashboard page
router.get('/', (req, res) => {
    res.render('dashboard', {
        pageTitle: "مدیریت وبلاگ من",
        path: '/dashboard',
        layout: './layouts/dashLayout'
    })
})


module.exports = router;
