//dependencies and it requires both files in the models folder, task.js and user.js
const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const Task = require('../models/task');
var User = require('../models/user');

//router.get (GET request) and res.render (compiles your template) is used to get the directories 
//and send the user to the page they which to be sent too, also validation like layout to choose the specific layout
//renders the addOrEdit.hbs page
router.get('/addOrEdit', (req, res) => {
    res.render("pages/addOrEdit", {
        viewTitle: "Insert Module"
    });
});

//renders the home.hbs page
router.get('/home', (req, res) => {
    res.render('pages/home', {
        layout: 'main.hbs'
    });
});

//renders the login.hbs page
router.get('/login', (req, res) => {
    res.render('pages/login', {
        layout: 'main.hbs'
    });
});

//renders the register.hbs page 
router.get('/register', (req, res) => {
    res.render('pages/register', {
        layout: 'main.hbs'
    });
});

//renders the index.hbs page
router.get('/index', function(req, res) {
    res.render('pages/index', {
        layout: 'main.hbs'
    });
});

//renders the edit.hbs page
router.get('/edit', function(req, res) {
    res.render('pages/edit', {
        layout: 'main.hbs'
    });
});

//checks comparison of two values to either insert new data - runs the insertRecord function - or updates the data - runs the updateRecord function
router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

//login and registration section - use of login.hbs and register.hbs

//POST route for updating data
router.post('/pages/login', function(req, res, next) {
    // confirm that user typed same password twice, if not it will inform the user
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }
    //the data inputted is inserted into the database, everything but the confirmed password
    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {

        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        }
        //creating a new user, if the user already exists the application with inform the user, otherwise, it will render the home.hbs page
        User.create(userData, function(error, user) {
            if (error) {
                res.send('Sorry, a user already exists with these details, please try again!');
            } else {
                return res.render('pages/home');
            }
        });
    //authenticatication for the user when logging in, if the either the email or password is incorrect, then the user will be informed of the wrong
    //combination, otherwise it will render the home.hbs page
    } else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function(error, user) {
            if (error || !user) {
                res.send('Sorry, you have used the wrong combination of email and password, please try again!');
            } else {
                return res.render('pages/home');
            }
        });
    //validation to ensure that all input fields have been used, if not, the error message will appear to the user
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
})

//GET reuqest for logout, if the user logs out, it will render the login.hbs page
router.get('/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.render('pages/login');
            }
        });
    }
});

//project page section - addOrEdit.hbs and list.hbs

//inserting data considering the project, coursework etc including validation, if there is no error with the inputted validation, the user will 
//be redirected to the list.hbs page, else if the error is a validation error, it will render the addOrEdit.hbs page and else will state to the
//user that there was an error with inserting a new record of data followed by the type of error
function insertRecord(req, res) {
    var project = new Project();
    project.project1 = req.body.project1;
    project.module = req.body.module;
    project.dueDate = req.body.dueDate;
    project.comDate = req.body.comDate;
    project.save((err, doc) => {
        if (!err)
            res.redirect('pages/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("pages/addOrEdit", {
                    viewTitle: "Insert Module",
                    project: req.body
                });
            } else
                console.log('Error during record insertion : ' + err);
        }
    });
}

//function to allow users to be able to edit their list of courseworks etc, if there is no errors, the user will be redirected to the list.hbs page
//however, if there is an error that is a validation error, it will render the addOrEdit.hbs page and else will state to the
//user that there was an error with inserting a new record of data followed by the type of error
function updateRecord(req, res) {
    Project.findOneAndUpdate({
        _id: req.body._id
    }, req.body, {
        new: true
    }, (err, doc) => {
        if (!err) {
            res.redirect('pages/list');
        } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("pages/addOrEdit", {
                    viewTitle: 'Update Module',
                    project: req.body
                });
            } else
                console.log('Error during record update : ' + err);
        }
    });
}

//get reuqest to get the list.hbs page rendered if there is no error, else it will display the message in the console log that there was trouble
//in retrieving the module list
router.get('/list', (req, res) => {
    Project.find((err, docs) => {
        if (!err) {
            res.render("pages/list", {
                list: docs
            });
        } else {
            console.log('Error in retrieving module list :' + err);
        }
    });
});

//function for if these fields hit an error, for reference, the addOrEdit.hbs page in the div section with the class 'text-danger' for the fullName
//validation, wherease the module is 10 lines below it in an input field
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

//finding the inserted data by id and rendering the addOrEdit.hbs page with updated data
router.get('/:id', (req, res) => {
    Project.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("pages/addOrEdit", {
                viewTitle: "Update Module",
                project: doc
            });
        }
    });
});

//deleting selecting coursework/module and redirecting the user to the list.hbs page, unless there is an error in which the console.log
//will display a message followed by the error
router.get('/delete/:id', (req, res) => {
    Project.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/pages/list');
        } else {
            console.log('Error in module delete :' + err);
        }
    });
});

//milestone section - index.hbs file and edit.hbs 

//sorting tasks, sets them to lowercase, also keeps them in alphabetical order
const sortTask = (a, b) => {
    const taskA = a.task.toLowerCase();
    const taskB = b.task.toLowerCase();
    return (taskA < taskB) ? -1 : (taskA > taskB) ? 1 : 0;
}

//render the index page and show the result
//note the public folder for further details
//findAll uses the sortTask as explained above and renders the index.hbs page using the main.hbs layout in the layouts folder
module.exports = {
    findAll: function(req, res) {
        Task
            .find({})
            .then(result => {
                result.sort(sortTask)
                res.render('pages/index', {
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
    //finding the task when you wish to edit it, it will render the edit.hbs page so you can edit this specific milestone
    findOne: function(req, res) {
        Task
            .findOne({
                _id: req.params.id
            })
            .then(result => {
                result.layout = 'main.hbs';
                res.render('pages/edit', result); 
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