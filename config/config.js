/**
 * Module dependencies.
 */

var path = require('path');

var development = require('./dev_env');
var test = require('./test_env');
var production = require('./prod_env');

var defaults = {
	root: path.normalize(__dirname + '/../'),
	mail: {
		mandrillKey: 'pwABzp6CtEQKsLD-lUNx7g',
		from: 'system@caretocall.com'
	}
};

/**
 * Expose
 */

module.exports = {
	//development: development,
	test: test,
	//production: production
}[process.env.NODE_ENV || 'test'];