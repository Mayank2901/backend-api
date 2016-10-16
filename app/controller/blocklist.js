var mongoose = require('mongoose');
var Blocklist = mongoose.model('BlockList');
var session = require('./../libs/session');

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

	router.route('/admin/blocklist')
    .post(methods.addnumber)
    .get(methods.getallnumbers)
    .delete(methods.deletenumber)
}

methods.addnumber = function(req,res){

	req.checkBody('number', 'Number cannot be empty.').notEmpty();
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
	  	new Blocklist({
	  		number : req.body.number
	  	}).save(function(err,data){
	  		if(err){
	  			response.error = true;
		        response.code = 10901;
		        response.errors = errors;
		        response.userMessage = 'server error occured.';
		        return SendResponse(res, 500);
	  		}
	  		else{
	  			response.userMessage = 'NUmber added to blocklist successfully.'
	            response.data = {
	            	block_list : data
	            }
	            response.error = false;
	            response.code = 200;
	            return SendResponse(res, 200);
	  		}
	  	});
	  }
}

methods.getallnumbers = function(req,res){
	Blocklist.findAll({

	})
	.lean()
	.exec(function(err,list){
		if(err){
	  		response.error = true;
		    response.code = 10901;
		    response.errors = errors;
		    response.userMessage = 'server error occured.';
		    return SendResponse(res, 500);
	  	}
	  	else{
	  		response.userMessage = 'NUmber added to blocklist successfully.'
	        response.data = {
	           	block_list : list
	        }
	        response.error = false;
	        response.code = 200;
	        return SendResponse(res, 200);
	  	}
	});
}

methods.deletenumber = function(req,res){
	req.checkBody('number', 'Number cannot be empty.').notEmpty();
	Blocklist.findOneAndRemove({
		number : req.body.number
	})
	.lean()
	.exec(function(err,list){
		if(err){
	  			response.error = true;
		        response.code = 10901;
		        response.errors = errors;
		        response.userMessage = 'server error occured.';
		        return SendResponse(res, 500);
	  		}
	  		else{
	  			response.userMessage = 'NUmber added to blocklist successfully.'
	            response.data = {
	            	block_list : list
	            }
	            response.error = false;
	            response.code = 200;
	            return SendResponse(res, 200);
	  		}
	});
}