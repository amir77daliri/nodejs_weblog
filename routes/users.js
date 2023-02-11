const {Router} = require('express');

const userController = require('../controllers/userController');

const router = new Router();


// login page
router.get("/login", userController.login);

// register page
router.get("/register", userController.register)


// handle register user
router.post("/register", userController.createUser);


module.exports = router;