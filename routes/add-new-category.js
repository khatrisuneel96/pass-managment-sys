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

router.get('/',checkUserLogin, function(req, res, next) {
    var loginUser = req.session.userLogin;
    res.render('add-new-category', { title: 'Password Management System', loginUser: loginUser, errors: '', success:'' });
  });
  
  router.post('/',checkUserLogin, [check('passwordCategory', 'Enter Your Password Cataegory').isLength({ min: 1 })], function(req, res, next) {
    var loginUser = req.session.userLogin;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('add-new-category', { title: 'Password Management System', loginUser: loginUser, errors: errors.mapped(), success:''});
    }else{
      var passCatName = req.body.passwordCategory;
      var passCatDetails = new passCatModel({password_category: passCatName});
      passCatDetails.save(function(err, doc){
        if(err) throw err;
        res.render('add-new-category', { title: 'Password Management System', loginUser: loginUser, errors: '', success: 'Password Category Added Successfully!' });
      });
    };
  });

module.exports = router;