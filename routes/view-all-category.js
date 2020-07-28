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

//Original
// router.get('/view-all-category',checkUserLogin, function(req, res, next) {
//   var loginUser = localStorage.getItem('loginUser');
//   getPassCat.exec(function(err, data){
//     if(err) throw err;
//     res.render('view-all-category', { title: 'Password Management System', loginUser: loginUser, records:data });
//   });
// });

router.get('/',checkUserLogin, function(req, res, next) {
    var loginUser = req.session.userLogin;
    var options = {
      lean:     true,
      offset:   1,
      limit:    5
    };
    passCatModel.paginate({}, options).then(function(result){
      res.render('view-all-category', { title: 'Password Management System', 
      loginUser: loginUser, 
      records:result.docs,
      current: result.offset,
      pages: Math.ceil(result.total / result.limit) });
    });
});
  
router.get('/:page',checkUserLogin, function(req, res, next) {
    var loginUser = req.session.userLogin;
    var perPage = 5;
    var page = req.params.page || 1;
    getPassCat.skip((perPage * page) - perPage)
    .limit(perPage).exec(function(err, data){
      if(err) throw err;
      passwordModel.countDocuments({}).exec((err,count)=>{
      res.render('view-all-category', { title: 'Password Management System', 
      loginUser: loginUser, 
      records:data,
      current: page,
      pages: Math.ceil(count / perPage) });
    });
  });
});
  
router.get('/delete/:id',checkUserLogin, function(req, res, next) {
    var loginUser = req.session.userLogin;
    var passCat_id = req.params.id;
    var passCatDelete =  passCatModel.findByIdAndDelete(passCat_id);
    passCatDelete.exec(function(err){
      if(err) throw err;
      res.redirect('/view-all-category');
    });
});
  
router.get('/edit/:id',checkUserLogin, function(req, res, next) {
    var loginUser = req.session.userLogin;
    var passCat_id = req.params.id;
    var getPassCat_Edit =  passCatModel.findById(passCat_id);
    getPassCat_Edit.exec(function(err, data){
      if(err) throw err;
      res.render('edit-password-category', { title: 'Password Management System', loginUser: loginUser, records:data, id: passCat_id});
    });
    
});
  
router.post('/edit/',checkUserLogin, function(req, res, next) {
    var loginUser = req.session.userLogin;
    var passCat_id = req.body.id;
    var passwordCategory = req.body.passwordCategory;
    var updatePassCat =  passCatModel.findByIdAndUpdate(passCat_id, {password_category: passwordCategory});
    updatePassCat.exec(function(err, doc){
      if(err) throw err;
      res.redirect('/view-all-category');
    });
    
});

module.exports = router;