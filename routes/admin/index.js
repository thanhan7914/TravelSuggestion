const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

router.get('/',function(req,res){
  if(req.session.email){
    res.render('index');
  }else{
    res.redirect('/admin/login');
  }
});

router.get('/login',function(req,res){
  res.render('login');
});

//check login
router.post('/login',function(req,res){
  var email = req.body.email;
  var password = req.body.password;
  if(email ==='admin' && password ==='duataunhapcho'){
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
    res.render('post-news');
  }else{
    res.redirect('/admin/login');
  }
});

router.post('/post-news',function(req,res){

});

router.get('/add-place',function(req,res){
  if(req.session.email){
    res.render('add-place');
  }else{
    res.redirect('/admin/login');
  }
});

router.get('/list-news',function(req,res){
  if(req.session.email){
    res.render('list-news');
  }else{
    res.redirect('/admin/login');
  }
});

router.get('/list-place',function(req,res){
  if(req.session.email){
    res.render('list-place');
  }else{
    res.redirect('/admin/login');
  }
});


module.exports = router;
