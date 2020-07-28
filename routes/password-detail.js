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
    res.redirect('/dashboard');
  
});

router.get('/edit/:id',checkUserLogin, function(req, res, next) {
  var loginUser = req.session.userLogin;
  var id = req.params.id;
  var getPassDetail = passwordModel.findById({_id:id});
  getPassDetail.exec(function(err, data){
    if(err) throw err;
    getPassCat.exec(function(err, data1){
      res.render('edit-password', { title: 'Password Management System', loginUser: loginUser, records:data1, success:'', record:data });
    })
  });

});

router.post('/edit/:id',checkUserLogin, function(req, res, next) {
  var loginUser = req.session.userLogin;
  var id = req.params.id;
  var passCat = req.body.passCategory;
  var project_name = req.body.project_name;
  var passDetail = req.body.passDetails;
  passwordModel.findByIdAndUpdate(id,{password_category:passCat, project_name:project_name, password_details: passDetail}).exec(function(err){
    if(err) throw err;
    var getPassDetail = passwordModel.findById({_id:id});
    getPassDetail.exec(function(err, data){
      if(err) throw err;
      getPassCat.exec(function(err, data1){
        res.render('edit-password', { title: 'Password Management System', loginUser: loginUser, records:data1, success:'Password Detail Updated Successfully!', record:data });
      });
    });
  });
});


router.get('/delete/:id',checkUserLogin, function(req, res, next) {
  var loginUser = req.session.userLogin;
  var password_id = req.params.id;
  var passwordDelete = passwordModel.findByIdAndDelete(password_id);
  passwordDelete.exec(function(err, data){
    if(err) throw err;
    res.redirect('/view-all-password');
  });

});

module.exports = router;