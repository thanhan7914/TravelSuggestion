const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/TravelSuggestion', {useMongoClient: true});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    //attach function check validate ObjectId
    req.isValidObjectId = mongoose.Types.ObjectId.isValid;
    next();
});

//routing
app.use('/', require('./routes'));
app.use('/api', require('./routes/api'));
app.use('/admin', require('./routes/admin'));

app.use(function(req, res, next) {
  res.status(404);
  //res.render('error/404');
  res.json({error: 'Error 404 Not Found!'});
});

app.listen(port, function() {
    console.log('todo list RESTful API server started on: ' + port);
});
