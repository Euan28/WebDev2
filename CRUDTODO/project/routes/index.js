const router = require('express').Router();
const taskController = require('../controllers/employeeController');

router.get('/', taskController.findAll)

module.exports = router;
