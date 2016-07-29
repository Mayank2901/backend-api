/**
 * Module dependencies.
 */

var path = require('path');

var development = require('./dev_env');
var test = require('./test_env');
var production = require('./prod_env');


/**
 * Expose
 */

module.exports = {
	//development: development,
	test: test,
	//production: production
}[process.env.NODE_ENV || 'test'];