/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
//var LinkedInStrategy = require('passport-linkedin').Strategy;
var config = require('./../config');
var User = mongoose.model('User');
var Session = mongoose.model('Session');
var jwt = require('jsonwebtoken');
var passport = require('passport');

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    var options = {
      criteria: { email: email },
      select: 'first_name last_name email hashed_password salt'
    };
    User.load(options, function (err, user) {
      if (err) return done(err)
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'Invalid password' });
      }

      //create session here.
      Session.findOne({user:user._id})
      .lean()
      .exec(function(err,session){
        if(session){
          var token = jwt.sign({_id:String(user._id),first_name:user.first_name,last_name:user.last_name,email:user.email},config.sessionSecret,{ expiresInMinutes: 60*120 });
          Session.findOneAndUpdate({_id:session._id},{token:token})
          .lean()
          .exec(function(err,session1){
            Session.findOne({_id:session1._id})
            .lean()
            .exec(function(err,session2){
              console.log('session=====',session);
              return done(null, user,{
                sessionToken:session2.token,
                sessionId:session2._id
              }); 
            });
          });       
        }
        else{
          var token = jwt.sign({_id:String(user._id),first_name:user.first_name,last_name:user.last_name,email:user.email},config.sessionSecret,{ expiresInMinutes: 60*120 });
          var newSession = new Session({
            user : user._id,
            token:token
          });
          newSession.save();
          return done(null, user,{
            sessionToken:newSession.token,
            sessionId:newSession._id
          }); 
        }
      });
    });
  }
);
