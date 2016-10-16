var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blocklist = new Schema({
	number : {
		type : Number,
		index: {
	      unique: true
	    }
	},
	date : {
		type : Date,
		default : Date.now
	}
});

mongoose.model('BlockList',blocklist)