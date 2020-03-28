const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
	task: {
		type: String,
	},
	completed: {
		type: Boolean,
		default: false
	},
	addedAt: {
		type: Date,
		default: Date.now()
	},
});

const Task = module.exports = mongoose.model('Task', taskSchema);

