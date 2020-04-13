require('./models/employee.model');
require('./models/task');

//dependencies 
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const logger = require('morgan');
const favicon = require('serve-favicon');
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//setting up the database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/testForAuth', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {});

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

const employeeController = require('./controllers/employeeController');

var app = express();

//setting up morgan middleware
app.use(logger('dev'));

// telling the system whether you want to use a simple algorithm for shallow parsing (i.e. false)
app.use(bodyparser.urlencoded({
    extended: false
}));
//telling the system we want to use json
app.use(bodyparser.json());

//telling the system we are using the views folder, including the layouts and hbs (handlebars) engine
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

//server starts on port 3000
app.listen(3000, () => {
    console.log('Express server started at port : 3000');
});

app.use('/employee', employeeController.router);

