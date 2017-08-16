var util = require('util');
var apiResponse = require('./apiResponse');

var commonFunction = {};
commonFunction.validate = validate;

module.exports = commonFunction;

function validate(req, res, required){	
	for(var key in required){		
		if(key == 'email'){
			var isEmpty = req.check(key, key+' must not be empty').notEmpty();
			if(!isEmpty.validationErrors[0]){
				req.assert('email', ' Valid email required').isEmail();
			}
		}
		else {
			req.check(key, key+' must not be empty').notEmpty();
		}
	}
	  var errors = req.validationErrors();
	  if (errors) {
	  	var errorResponse = apiResponse.setFailureResponse(util.inspect(errors));
		return errorResponse;
	  }
	  else{
	  	var successResponse = {
	  		"success":true
	  	};
	  	return successResponse;
	  }
}	