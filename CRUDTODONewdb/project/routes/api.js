const router = require('express').Router();
const taskController = require('../controllers/employeeController');

router
.route('/task/:id')
.get(taskController.findOne)
.put(taskController.complete)
.delete(taskController.deleteOne)

router.post('/create', taskController.create);

router.post('/update', taskController.updateName);

module.exports = router;