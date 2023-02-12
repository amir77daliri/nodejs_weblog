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

// handle Login 
router.post("/login", userController.handleLogin, userController.rememberMe);

// handle register user
router.post("/register", userController.createUser);


module.exports = router;