//dependencies 
const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const Task = require('../models/task');
var User = require('../models/user');

//router.get (GET request) and res.render (compiles your template) is used to get the directories 
//and send the user to the page they which to be sent too, also validation like layout to choose the specific layout
router.get('/', (req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "Insert Module"
    });
});

router.get('/home', (req, res) => {
    res.render('employee/home', {
        layout: 'main.hbs'
    });
});

router.get('/login', (req, res) => {
    res.render('employee/login', {
        layout: 'main.hbs'
    });
});

router.get('/register', (req, res) => {
    res.render('employee/register', {
        layout: 'main.hbs'
    });
});

router.get('/index', function(req, res) {
    res.render('employee/index', {
        layout: 'main.hbs'
    });
});

router.get('/edit', function(req, res) {
    res.render('employee/edit', {
        layout: 'main.hbs'
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

//POST route for updating data
router.post('/employee/login', function(req, res, next) {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }

    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {

        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        }
//creating a new user
        User.create(userData, function(error, user) {
            if (error) {
                return next(error);
            } else {
                return res.render('employee/addOrEdit');
            }
        });

    } else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function(error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                return res.render('employee/addOrEdit');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
})

//GET reuqest for logout
router.get('/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.render('employee/login');
            }
        });
    }
});

//inserting data considering the project, coursework etc including validation
function insertRecord(req, res) {
    var employee = new Employee();
    employee.project = req.body.project;
    employee.module = req.body.module;
    employee.dueDate = req.body.dueDate;
    employee.comDate = req.body.comDate;
    employee.save((err, doc) => {
        if (!err)
            res.redirect('employee/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insert Module",
                    employee: req.body
                });
            } else
                console.log('Error during record insertion : ' + err);
        }
    });
}

//function to allow users to be able to edit their list of courseworks etc
function updateRecord(req, res) {
    Employee.findOneAndUpdate({
        _id: req.body._id
    }, req.body, {
        new: true
    }, (err, doc) => {
        if (!err) {
            res.redirect('employee/list');
        } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Update Module',
                    employee: req.body
                });
            } else
                console.log('Error during record update : ' + err);
        }
    });
}

//get reuqest to get the list rendered
router.get('/list', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.render("employee/list", {
                list: docs
            });
        } else {
            console.log('Error in retrieving module list :' + err);
        }
    });
});

//function for if these fields hit an error
function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'module':
                body['moduleError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

//finding the inserted data by id and rendering the page with updated data
router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("employee/addOrEdit", {
                viewTitle: "Update Module",
                employee: doc
            });
        }
    });
});

//deleting selecting coursework/module
router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list');
        } else {
            console.log('Error in module delete :' + err);
        }
    });
});

//sorting tasks
const sortTask = (a, b) => {
    const taskA = a.task.toLowerCase();
    const taskB = b.task.toLowerCase();
    return (taskA < taskB) ? -1 : (taskA > taskB) ? 1 : 0;
}

//milestones section
//render the index page and show the result
//notice note the public folder for further details
module.exports = {
    findAll: function(req, res) {
        Task
            .find({})
            .then(result => {
                result.sort(sortTask)
                res.render('employee/index', {
                    layout: 'main.hbs',
                    tasks: result
                })
            })
            .catch(err => res.json(err))
    },
//create a  new milestone
    create: function(req, res) {
        Task
            .create(req.body)
            .then(result => {
                // result.sort(sortTask)
                res.json(result)
            })
            .catch(err => res.json(err));
    },

    findOne: function(req, res) {
        Task
            .findOne({
                _id: req.params.id
            })
            .then(result => {
                result.layout = 'main.hbs';
                res.render('employee/edit', result); 
            })
            .catch(err => res.json(err))
    },
//complete function if you want a milestone to be completed
    complete: function(req, res) {
        Task
            .findOneAndUpdate({
                _id: req.params.id
            }, {
                completed: true
            })
            .then(result => res.json(result))
            .catch(err => res.json(err))
    },
//delete function if you want a milestone to be deleted
    deleteOne: function(req, res) {
        Task
            .remove({
                _id: req.params.id
            })
            .then(result => res.json(result))
            .catch(err => res.json(err))
    },
//update function if you want a milestone to be updated
    updateName: function(req, res) {
        Task
            .findOneAndUpdate({
                _id: req.body._id
            }, {
                task: req.body.task
            })
            .then(result => res.json(result))
            .catch(err => res.json(err))
    },
    router
}