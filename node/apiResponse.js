const winston = require('winston');
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error_log/api-error.log' })
  ]
});

const setSuccessResponse = function(res_code, message, data) {
	const apiResponse = {
		"code": res_code,
		"message": message,
		"data": data
	}
	return apiResponse;
}

const setFailureResponse = function(err) {
	const apiResponse = {
		"code": 400,
		"message": "Bad Request. Please see data for inner exception.",
		"data": {
			"errMsg": err
		}
	}
	return apiResponse;
}

const setSystemFailureResponse = function(err) {
	const apiResponse = {
		"code": 500,
		"message": "Internal Server Error. Please see data for inner exception.",
		"data": {
			"errMsg": err
		}
	}
	logger.log('error', err, 'my string');
	return apiResponse;
}

module.exports.setSuccessResponse = setSuccessResponse;
module.exports.setFailureResponse = setFailureResponse;
module.exports.setSystemFailureResponse = setSystemFailureResponse;
//exports.setResponse = setResponse;