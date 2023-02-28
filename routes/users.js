const {Router} = require('express');

const userController = require('../controllers/userController');
const { authenticated } = require('../middleware/auth');

const router = new Router();


// login page
router.get("/login", userController.login);

// handle logout
router.get("/logout", authenticated, userController.logout);

// register page
router.get("/register", userController.register)

// forgetPass page
router.get("/forget-password", userController.forgetPassword);

// resetPass page
router.get("/reset-password/:token", userController.getResetPass);

// handle Login 
router.post("/login", userController.handleLogin, userController.rememberMe);

// handle register user
router.post("/register", userController.createUser);

//send resetPass email --> handling reserPass
router.post('/forget-password', userController.handleForgetPassword);

//handling change password --> set new password
router.post('/reset-password/:id', userController.setNewPassword);

module.exports = router;