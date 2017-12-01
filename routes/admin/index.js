const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

router.get('/',function(req,res){
  if(req.session.email){
    res.render('index',{title:'Travel suggestion | Admin'});
  }else{
    res.redirect('/admin/login');
  }
});


router.get('/login',function(req,res){
  res.render('login',{title:'Login'});
});

//check login
router.post('/login',function(req,res){
  var email = req.body.email;
  var password = req.body.password;
  if(email ==='admin' && password ==='admin'){
    req.session.email = req.body.email;
    res.redirect('/admin');
  }else{
    res.redirect('/admin/login');
  }
});
//logout
router.get('/logout',function(req,res){
  delete req.session.email;
  res.redirect('/admin/login');
});

router.get('/add-news',function(req,res){
  if(req.session.email){
    res.render('add-news',{title:'Add news | Admin'});
  }else{
    res.redirect('/admin/login');
  }
});


router.get('/add-place',function(req,res){
  if(req.session.email){
    res.render('add-place',{title:'Add place | Admin'});
  }else{
    res.redirect('/admin/login');
  }
});

router.get('/all-news',function(req,res){
  if(req.session.email){
    res.render('all-news',{title:'All news | Admin'});
  }else{
    res.redirect('/admin/login');
  }
});

router.get('/all-places',function(req,res){
  if(req.session.email){
    res.render('all-places',{title: 'Add place | Admin'});
  }else{
    res.redirect('/admin/login');
  }
});

router.get('/edit-place/place-id/:id', function (req,res) {
  if (req.session.email) {
    res.render('edit-place', { title: 'Admin | Edit-place', place_id: req.params.id });
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/edit-news/news-id/:id', function (req,res) {
  if (req.session.email) {
    res.render('edit-news', { title: 'Admin | Edit-news', news_id: req.params.id });
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/add-event', function (req,res) {
  if (req.session.email) {
    res.render('add-event', { title: 'Add event' });
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/all-event', function (req, res) {
  if (req.session.email) {
    res.render('all-event', { title: 'All event' });
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/edit-event/event-id/:id', function (req, res) {
  if (req.session.email) {
    res.render('edit-event', { title: 'Admin | Edit-event', event_id: req.params.id });
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/show-news/:news_id', function (req, res) {
  if (req.session.email) {
    res.render('show-news', { title: 'Admin | Show-news', news_id: req.params.news_id });
  } else {
    res.redirect('/admin/login');
  }
});
module.exports = router;
