exports.get404 = (req, res) => {
    res.render('errors/404', {
        pageTitle: "صفحه یافت نشد || 404",
        path: '/404'
    })
}


exports.get500 = (req, res) => {
    res.render('errors/500', {
        pageTitle: "مشکلی رخ داد | 500",
        path: "/404"
    })
}