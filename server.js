var fs = require('fs');
var session = require('express-session');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');

var expressValidator = require('express-validator');
var config = require('./config/config');


//var multer=require('multer');

app.use(expressValidator());
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: true
}));
//app.use(session({secret: 'ssshhhhh'}));
app.use(passport.initialize());
//app.use(passport.session());
var port = process.env.PORT || 3000; // set our port

// Connect to mongodb
var connect = function() {
	var options = {
		server: {
			socketOptions: {
				keepAlive: 1
			}
		}
	};
	console.log(config.db);
	mongoose.connect(config.db, options);
};
connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);



// Bootstrap models
fs.readdirSync(__dirname + '/app/models').forEach(function(file) {
	if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file);
});

// Bootstrap libs
// fs.readdirSync(__dirname + '/app/libs').forEach(function(file) {
// 	if (~file.indexOf('.js')) require(__dirname + '/app/libs/' + file);
// });

// Bootstrap passport config
require('./config/passport')(passport, config);

// Bootstrap application settings
require('./config/express')(app, passport);

// Bootstrap routes
var router = express.Router();
require('./config/routes')(router, passport);
app.use('/', router);


// if (process.env.NODE_ENV != 'test') {
	
// 	var cluster = require('cluster');
// 	var numCPUs = require('os').cpus().length;

// 	//using cores
// 	if (cluster.isMaster) {
// 		// Fork workers.
// 		for (var i = 0; i < numCPUs; i++) {
// 			console.log("Worker",i);
// 			cluster.fork();
// 		}

// 		cluster.on('exit', function(worker, code, signal){
// 			console.log('worker ${worker.process.pid} died');
// 		});
// 	} else {
// 		// Workers can share any TCP connection
// 		// In this case it is an HTTP server
// 		var server = app.listen(port);
// 		var io = require('socket.io')(server);
// 		console.log('API started, Assigned port : ' + port);
// 	}

// }
module.exports = app;
