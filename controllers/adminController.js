

exports.getDashboard = async(req, res) => {
    res.render('./private/blogs', {
        pageTitle: "مدیریت | داشبورد",
        path: "/dashboard",
        layout: "./layouts/dashLayout",
        fullname: req.user.fullname
    })
}