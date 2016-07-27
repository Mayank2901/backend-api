var mongoose = require('mongoose');
var Session = mongoose.model('Session');
var session = {};


var response = {
	error:false,
	code:"",
	data:null,
	userMessage:''
};
var SendResponse = function(res,status){
	return res.status(status || 200).send(response);
};

/*********************
	Checking for token of loggedin user
*********************/


session.checkToken = function(req,res,next){

	console.log("session");
	var bearerToken;
	//console.log('rh==',req.headers);
	var bearerHeader = req.headers["authorization"];
    if (typeof(bearerHeader) !== 'undefined') {
    	//console.log('bH',bearerHeader)
        var bearer = bearerHeader.split(" ");
        //console.log('b',bearer)
        bearerToken = bearer[1];
        //console.log('bT',bearerToken)
        req.token = bearerToken;
        //bearerToken = bearerToken.slice(1,bearerToken.length).slice(0,-1);
    }
	var token = bearerToken || req.body.token || req.query.token;
	//console.log('t:',token)
	Session
	.findOne({token:token})
	.populate('user',{_id:true,email:true,name:true,companyid:true,email_verified:true,profile:true,phone_verified:true,phone:true,profile_picture:true,coupon_code:true})
	.lean()
	.exec(function(err,data){
		if(err){
			console.log('err:',err)
			response.error = true;
			response.code = 10901;
			response.userMessage = "There was a problem with the request, please try again."
			return SendResponse(res,500);
		}
		else{
			if(data)
			{ // Horray!! Your session exists.
				//console.log('d==',data);
				req.user = data.user;
				console.log("user",req.user);
				return next();
			}
			else
			{
				response.error = true;
				response.userMessage = "Your session doesn't exists.";
				return SendResponse(res,403);
			}
		}
	});
};

/*********************
	checkToken Ends
*********************/
console.log('session:',session);
module.exports = session;