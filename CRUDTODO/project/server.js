require('./models/db');
require('./models/task');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const favicon = require('serve-favicon');

const employeeController = require('./controllers/employeeController');

var app = express();

//setting up morgan middleware
app.use(logger('dev'));

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');

//serving blank favicon to keep from throwing 404 errors
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

//setting up static path for serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Bringing in the routes
const index = require('./routes/index');
const api = require('./routes/api');

app.use('/', index);
app.use('/api', api);


app.listen(3000, () => {
    console.log('Express server started at port : 3000');
});

app.use('/employee', employeeController.router);

