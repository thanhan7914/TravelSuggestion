const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session		=	require('express-session');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/TravelSuggestion', {useMongoClient: true});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//use session
app.use(session({
  secret: 'de lam gi deo biet',
  saveUninitialized: true,
  resave: true
}));

//set views engine
app.use('/public',express.static( __dirname + '/public'));
app.set('view engine','ejs');

app.use(require('./midez'));

//routing
app.use('/', require('./routes'));
app.use('/api', require('./routes/api'));
app.use('/admin', require('./routes/admin'));

app.use(function(req, res, next) {
  res.status(404);
  res.render('error/404');
  // res.json({error: 'Error 404 Not Found!'});
});

app.listen(port, function() {
    console.log('TravelSuggestion RESTful API server started on: ' + port);
});
