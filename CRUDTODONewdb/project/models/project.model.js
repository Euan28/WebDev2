//dependency
const mongoose = require('mongoose');

//data inputted into the database, coursework, project, due date and completion date, validation included
var projectSchema = new mongoose.Schema({
    project1: {
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

mongoose.model('Project', projectSchema);