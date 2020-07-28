var express = require('express');
var router = express.Router();
var userModel = require('../modules/user');
var passCatModel = require('../modules/password-category');
var passwordModel = require('../modules/add-password');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
var getPassCat = passCatModel.find({});
var getPassword = passwordModel.find({});

/* GET home page. */
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkUserLogin(req, res, next){
  var userToken = localStorage.getItem('userToken');
  try {
    if(req.session.userLogin){
      var decoded = jwt.verify(userToken, 'loginToken');
    }else{
      res.redirect('/');
    }
    
  } catch(err) {
    res.redirect('/');
  }
  next();
}

function checkUsername(req, res, next){
  var username = req.body.username;
  var checkSameUsername =  userModel.findOne({username: username});
  checkSameUsername.exec((err, data)=>{
    if(err) throw err;
    if(data){
      res.render('signup', { title: 'Password Management System', msg: 'Username Already Exist!', success:''});
    };
    next();
  });
};

function checkEmail(req, res, next){
  var email = req.body.email;
  var checkSameEmail =  userModel.findOne({email: email});
  checkSameEmail.exec((err, data)=>{
    if(err) throw err;
    if(data){
    res.render('signup', { title: 'Password Management System', msg: 'Email Already Exist!', success:''});
    };
    next();
  });
};

router.get('/', function(req, res, next) {
  var loginUser = req.session.userLogin;
  if(loginUser){
    res.redirect('./dashboard');
  }else{
    res.render('index', { title: 'Password Management System', msg:''});
  }
});

router.post('/', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var checkUser = userModel.findOne({username:username});
  checkUser.exec((err, data)=>{
    if(err) throw err;
    var getUserID = data._id;
    var getPassword = data.password;
    if(bcrypt.compareSync(password, getPassword)){
      var token = jwt.sign({ userID: getUserID }, 'loginToken');
      localStorage.setItem('userToken', token);
      localStorage.setItem('loginUser', username);
      req.session.userLogin=username;
      res.redirect('/dashboard');
    }else{
      res.render('index', { title: 'Password Management System', msg: 'Username and Password does not matched' });
    }
  });
  
});

router.get('/signup', function(req, res, next) {
  var loginUser = req.session.userLogin;
  if(loginUser){
    res.redirect('./dashboard');
  }else{
  res.render('signup', { title: 'Password Management System', msg:'', success:'' });
  }
});

router.post('/signup', checkUsername, checkEmail, function(req, res, next) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var cpassword = req.body.cpassword;
  
  if(password != cpassword){
    res.render('signup', { title: 'Password Management System', msg: 'Password does not match!', success:''});
  }
  else{
    password = bcrypt.hashSync(password, 10);
    var userDetails = new userModel({
      username: username,
      email: email,
      password: password
    
  });

  userDetails.save((err, doc)=>{
    if(err) throw err;
    res.render('signup', { title: 'Password Management System', msg:'', success:'User Registored Successfully'});
  });
  }
  
});

router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    if(err){
      res.redirect('/');
    }
  })
  res.redirect('/');
});

module.exports = router;
