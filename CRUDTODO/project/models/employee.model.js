const mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'This field is required.'
    },
    module: {
        type: String
    },
    mobile: {
        type: String
    },
    city: {
        type: String
    }
});



mongoose.model('Employee', employeeSchema);