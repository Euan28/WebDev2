const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const Task = require('../models/task');

router.get('/', (req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "Insert Module"
    });
});

router.get('/test', (req, res) => {
    res.render("employee/test");
});




router.get('/index', function(req, res) {
    res.render('employee/index', {layout: 'main.hbs'});
});

router.get('/edit', function(req, res) {
    res.render('employee/edit', {layout: 'main.hbs'});
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.module = req.body.module;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
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
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('employee/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Update Module',
                    employee: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.render("employee/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving module list :' + err);
        }
    });
});


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

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list');
        }
        else { console.log('Error in module delete :' + err); }
    });
});

const sortTask = (a,b) => {
    const taskA = a.task.toLowerCase();
    const taskB = b.task.toLowerCase();
    return (taskA < taskB) ? -1 : (taskA > taskB) ? 1 : 0;
  }
  
  module.exports = {
    findAll: function (req,res){
      Task
      .find({})
      .then(result => {
        result.sort(sortTask)
        res.render('employee/index', {layout: 'main.hbs', tasks: result })
      })
      .catch(err => res.json(err))
    },
 
    create: function(req,res){
      Task
      .create(req.body)
      .then(result => {
        // result.sort(sortTask)
        res.json(result)
      })
      .catch(err => res.json(err));
    },
 
    findOne: function (req,res){
        Task
        .findOne({_id: req.params.id})
        .then(result => {
          result.layout = 'main.hbs';
          res.render('employee/edit', result); // diff
        })
        .catch(err => res.json(err))
      },
 
    complete: function (req,res){
      Task
      .findOneAndUpdate({_id: req.params.id}, {completed: true})
      .then(result => res.json(result))
      .catch(err => res.json(err))
    },
 
    deleteOne: function (req,res){
      Task
      .remove({_id: req.params.id})
      .then(result => res.json(result))
      .catch(err => res.json(err))
    },
 
    updateName: function (req,res){
      Task
      .findOneAndUpdate({_id: req.body._id}, {task: req.body.task})
      .then(result => res.json(result))
      .catch(err => res.json(err))
    }
    ,router
  }
  
  