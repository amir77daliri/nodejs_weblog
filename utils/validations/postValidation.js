const Yup = require('yup');


const schema = Yup.object().shape({
    title: Yup.string()
        .required("عنوان مقاله الزامی است")
        .min(4, " عنوان مقاله نباید کمتر از 4 کاراکتر باشد")
        .max(100, "عنوان مقاله نباید  بیشتر از 100 کاراکتر باشد"),
    body: Yup.string()
        .required("محتوا الزامی است"),
    status: Yup.mixed().oneOf(["public", "private"], "وضعیت مقاله معتبر نیست")
});


module.exports = schema;