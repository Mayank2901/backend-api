var mongoose = require('mongoose');
var Product = mongoose.model('Products');
var Session = mongoose.model('Session');
var session = require('session');

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
      .post(methods.addproduct)
}

/*******************************************************
  method to add a new product
********************************************************/

method.addproduct=function(req,res){
  req.checkBody('image', 'image cannot be empty.').notEmpty();
  req.checkBody('category', 'category cannot be empty.').notEmpty();
  req.checkBody('name', 'name cannot be empty.').notEmpty();
  req.checkBody('price', 'price cannot be empty.').notEmpty();
  req.checkBody('brand', 'brand cannot be empty.').notEmpty();
  req.checkBody('instock', 'instock cannot be empty.').notEmpty();
  
  var errors = req.validationErrors(true);
  if (errors) {
    console.log('err:', errors)
    response.error = true;
    response.code = 400;
    response.errors = errors;
    response.userMessage = 'Validation errors';
    return SendResponse(res, 400);
  }
  else{
    var newproduct=new Product({
      image:req.body.image,
      category:req.body.category,
      name:req.body.name,
      price:req.body.price,
      brand:req.body.brand,
      instock:req.body.instock
    });
    newproduct.save(function(err, user) {
      if (err) {
        response.error = true;
        response.code = 10800;
        response.userMessage = 'Could not save user to database'
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
}

/*******************************************************
  addproduct ends
********************************************************/