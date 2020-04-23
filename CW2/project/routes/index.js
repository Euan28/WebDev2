//dependencies 
const router = require('express').Router();
const taskController = require('../controllers/projectController');
//used to complete actions stored in the controller, see projectController.js file for reference and further explanation 
router.get('/', taskController.findAll)

module.exports = router;
