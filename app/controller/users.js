var mongoose = require('mongoose');
var User = mongoose.model('User');
var Session = mongoose.model('Session');
var jwt = require('jsonwebtoken');
var uuid = require('node-uuid');
var session = require('session');
var passport = require('passport');

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

	router.route('/users')
      .post(methods.userSignup)

    router.route('/users/session')
      .post(methods.userLogin)
      .delete(session.checkToken, methods.userLogout)
}

var codes = function() {
  return uuid.v1();
};


/*==============================================
***   method to create new User in mysql  ***
================================================*/
methods.userSignup = function(req, res) {
  //Check for any errors.
  req.checkBody('email', 'Valid Email address is required.').notEmpty().isEmail();
  req.checkBody('phone', 'phone cannot be empty.').notEmpty().isInt();

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
    User.findOne({
      email: req.body.email
    }, function(err, user) {
    	if (err){
	        response.error = true;
	        response.code = 10901;
	        response.errors = errors;
	        response.userMessage = 'error';
	        return SendResponse(res, 500);
      	} 
      	else if (user) {
	        console.log("email exist");
	        response.error = true;
	        response.code = 10901;
	        response.userMessage = 'Email already in use.'
	        response.data = null;
	        response.errors = null;
	        return SendResponse(res, 409);
      	}
      	else{
	        console.log("user doest not exist");
	        var newUser = new User({
	          email: req.body.email,
	          unique_code: codes(),
	          password: req.body.password
	        });
	        newUser.save(function(err, user) {
	          if (err) {
	            response.error = true;
	            response.code = 10800;
	            response.userMessage = 'Could not save user to database'
	            response.data = null;
	            response.errors = null;
	            return SendResponse(res, 400);
	          }
	          else {
	            var token = jwt.sign({
	                email: req.body.email
	            }, 'thisisareallylongandbigsecrettoken', {
	                expiresInMinutes: 60 * 120
	            });
	            var newSession = new Session({
	                user: user._id,
	                token: token
	            });
	            newSession.save(function(err, session) {
	                if (err) {
	                    console.log('err=', err);
	                    response.error = true;
	                    response.code = 10902;
	                    response.userMessage = 'Oops! Our bad! The server slept while doing that, we just poured it with some coffee. Can you please try doing it again?'
	                    response.data = null;
	                    response.errors = null;
	                    return SendResponse(res, 500);
	                }
	                else {
	                    response.userMessage = 'Signup done, you are being redirected to dashboard.otp sent'
	                    response.data = {
	                      token: session.token,
	                      user: {
	                        email: user.email,
	                        _id: user._id,
	                        email_verified: user.email_verified
	                      }
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
};
/*********************
    userSignup Ends
*********************/

/*********************
  Create user login and send session info
*********************/
methods.userLogin = function(req, res, next) {
  NullResponseValue();
  //Check for any errors.
  req.checkBody('email', 'phone number is required.').notEmpty();
  req.checkBody('password', 'Password is required, and should be between 8 to 80 characters.').notEmpty();
  var errors = req.validationErrors(true);
  if (errors) {
    console.log('err:', errors);
    response.error = true;
    response.errors = errors;
    response.userMessage = 'Validation errors';
    response.data = null;
    response.code = 400;
    return SendResponse(res, 400);
  }
  else {
    passport.authenticate('local', function(err, user, info) {
      if (err){
      	console.log('error:', err);
        response.error = true;
        response.code = 10901;
        response.userMessage = 'Oops! Our bad! The server slept while doing that, we just poured it with some coffee. Can you please try doing it again?'
        response.data = null;
        response.errors = null;
        return SendResponse(res, 500);
      } 
      else{
        if (!user) {
          //console.log('user:', user)
          response.error = true;
          response.code = 401; //user Doesn't exists
          response.data = null;
          response.userMessage = info.message;
          return SendResponse(res, 401);
        }
        else{  
        	response.error = false;
            response.code = 200;
            response.userMessage = 'Thanks for logging in.';
            response.data = {
                token: info.sessionToken,
                user: {
                    email: user.email,
            	    name: user.name,
                    _id: user._id,
                    unique_code: user.unique_code,
                    phone: user.phone,
                    phone_verified: user.phone_verified
                }
            };
            response.errors = null;
            return SendResponse(res, 200);
        }
      }
    })(req, res, next);
  }
};

/*********************
  userLogin ends
*********************/

/*********************
        user logout
*********************/
methods.userLogout = function(req, res) {
  NullResponseValue();
  Session.findOneAndRemove({
      user: req.user._id
    })
    .lean()
    .exec(function(err) {
      if (err) {
        console.log('err:', err);
        response.error = true;
        response.code = 10903;
        response.userMessage = 'There was a problem with the request, please try again.'
        return SendResponse(res, 500);
      } else {
        response.data = null;
        response.error = false;
        response.userMessage = 'User Logged Out successfully';
        response.code = 200;
        response.errors = null;
        return SendResponse(res, 200);
      }
    });
};
/*********************
        userLogout Ends
*********************/