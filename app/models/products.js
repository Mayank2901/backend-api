var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var productSchema = new Schema({
	image:{
		type:String
	},
	category:{
		type:String
	},
	name:{
		type:String
	},
	price:{
		type:Number
	},
	brand:{
		type:String
	},
	description:{
		type:String
	},
	instock:{
		type:Boolean,
    	default: false
	}
});

mongoose.model('Products', productSchema);