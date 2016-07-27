var mongoose = require('mongoose');
var Product = mongoose.model('Products');
var Session = mongoose.model('Session');
var multer=require('multer');
var gm=require('gm');

var response = {
  error: false,
  code: "",
  data: null,
  userMessage: '',
  errors: null
};

var NullResponseValue = function() {
  response = {
    error: false,
    code: "",
    data: null,
    userMessage: '',
    errors: null
  };
  return true;
};
var SendResponse = function(res, status) {
  res.status(status || 200).send(response);
  NullResponseValue();
};

var methods = {};
/*
Routings/controller goes here
*/
module.exports.controller = function(router) {

	router.route('/product')
    .post(methods.addproduct) //TODO
}

/*******************************************************
  method to add a new product
********************************************************/

methods.addproduct=function(req,res){
  req.checkBody('category', 'category cannot be empty.').notEmpty();
  req.checkBody('name', 'name cannot be empty.').notEmpty();
  req.checkBody('price', 'price cannot be empty.').notEmpty();
  req.checkBody('brand', 'brand cannot be empty.').notEmpty();
  req.checkBody('instock', 'instock cannot be empty.').notEmpty();
  
  var errors = req.validationErrors(true);
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'/home/mayank/Desktop/backend-api/img')
    },
    filename: function (req, file, cb) {
      cb(null,'testing')
    }
  });
  var uploadfile = multer({
    storage: storage,
    limits:{
      fileSize: '2MB'
    }
  }).single('picture');
  if (errors) {
    console.log('err:', errors)
    response.error = true;
    response.code = 400;
    response.errors = errors;
    response.userMessage = 'Validation errors';
    return SendResponse(res, 400);
  }
  else{
    var uploadfile = multer({
    storage: storage,
    limits:{
      fileSize: '2MB'
    }
  }).single('picture');
  uploadfile(req, res, function(err) {
    console.log('r.f',req.files);
    if(err){
      console.log('r.f',req.files);
      console.log('err0:',err);
      response.error = true;
      response.code = 10903;
      response.data={req:req.file};
      response.userMessage = 'Oops! Our bad! The server slept while doing that, we just poured it with some coffee. Can you please try doing it again?'
      return SendResponse(res, 500);
    }
    else{
      gm('/home/mayank/Desktop/backend-api/img'+'/'+'testing')
      .resize(100,100)
        .write('/home/mayank/Desktop/backend-api/img/'+'small.jpg', function (err) {
          if (err)
          {
            console.log('r.f',req.file);
            console.log('err1:',err);
            response.error = true;
            response.code = 10901;
            response.data={req:req.file};
            response.userMessage = 'There was a problem with the request, please try again.';
            console.log('There was a problem with the request, please try again.');
            return SendResponse(res,500);
          }
          else
          {
            console.log("done uploading");
            var newproduct=new Product({
              image:'/home/mayank/Desktop/backend-api/img/'+'small.jpg',
              category:req.body.category,
              name:req.body.name,
              price:req.body.price,
              brand:req.body.brand,
              instock:req.body.instock
            });
            newproduct.save(function(err, product) {
              if (err) {
                response.error = true;
                response.code = 10800;
                response.userMessage = 'Could not save product to database'
                response.data = null;
                response.errors = null;
                return SendResponse(res, 400);
              }
              else {
                response.userMessage = 'Product saved'
                response.data = {
                  product:newproduct
                };
                response.error = false;
                response.code = 200;
                return SendResponse(res, 200);
              }
            });
          }
        });
    }
  });
  }
}

/*******************************************************
  addproduct ends
********************************************************/