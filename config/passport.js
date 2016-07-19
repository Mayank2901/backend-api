/*!
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');
var local = require('./passport/local');
/**
 * Expose
 */

module.exports = function(passport, config) {
  // serialize sessions
  passport.serializeUser(function(user, done) {
    console.log('serializing', user);
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    console.log("deserializing ", id);
    User.findOne({
      _id: id
    }, function(err, user) {
      done(err, user)
    })
  })

  // use these strategies
  passport.use(local);
};