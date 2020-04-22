//dependencies 
const router = require('express').Router();
const taskController = require('../controllers/projectController');
//used to complete actions stored in the controller 
router.get('/', taskController.findAll)

module.exports = router;
