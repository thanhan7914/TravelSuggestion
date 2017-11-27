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

router.get('/post-news',function(req,res){
  if(req.session.email){
    res.render('post-news',{title:'Post news | Admin'});
  }else{
    res.redirect('/admin/login');
  }
});

// router.post('/post-news',function(req,res){

// });

router.get('/add-place',function(req,res){
  if(req.session.email){
    res.render('add-place',{title:'Add place | Admin'});
  }else{
    res.redirect('/admin/login');
  }
});

router.get('/list-news',function(req,res){
  if(req.session.email){
    res.render('list-news',{title:'List news | Admin'});
  }else{
    res.redirect('/admin/login');
  }
});

router.get('/list-place',function(req,res){
  if(req.session.email){
    res.render('list-place',{title: 'Add place | Admin'});
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

module.exports = router;
