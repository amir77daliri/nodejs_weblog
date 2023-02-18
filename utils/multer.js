const multer = require('multer');
const {v4:uuid} = require('uuid');


exports.storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public/uploads/");
    },
    filename: (req, file, callback) => {
        console.log(file);
        callback(null, `${uuid()}_${file.originalname}`)
    }
})

exports.fileFilter = (req, file, callback) => {
    const imgFilter = ["image/jpeg", "image/jpg", "image/png"]
    if(imgFilter.includes(file.mimetype)){
        callback(null, true)
    } else {
        callback("عکس با پسوند مناسب انتخاب کنید.", false)
    }
}