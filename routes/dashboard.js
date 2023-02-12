const { Router } = require("express");
const { authenticated } = require('../middleware/auth');

const adminController = require('../controllers/adminController');
const router = new Router();

// dashboard page
router.get('/', authenticated, adminController.getDashboard)


module.exports = router;
