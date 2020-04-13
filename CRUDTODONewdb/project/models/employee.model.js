const mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    project: {
        type: String,
        required: 'This field is required.'
    },
    module: {
        type: String
    },
    dueDate: {
        type: String
    },
    comDate: {
        type: String
    }
});

mongoose.model('Employee', employeeSchema);