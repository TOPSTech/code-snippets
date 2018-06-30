const middleware = {};
const mongodb         = require('mongodb');
const mongoClient     = require('mongodb').MongoClient;
const commonService = require('./services/shared/common.service');
const orderCommonService = require('./services/shared/order-common.service');
const appConfig = require('./appConfig');
const apiResponse = require('./apiResponse');
const dbService = require('./mongoUtil');
const mcache = require('memory-cache');
const userRightsService = require('./services/user-rights.service');

middleware.usersCurrentSessionHandler = usersCurrentSessionHandler;
middleware.checkIfCompanyExist = checkIfCompanyExist;
middleware.checkIfFeatureActive = checkIfFeatureActive;
middleware.checkUserPermission = checkUserPermission;
middleware.checkAllPermission = checkAllPermission;
middleware.cache = cache;
module.exports = middleware;

function usersCurrentSessionHandler(req, res, next) {
	const objSession = {
		'SESSION_TIMED_OUT': false
	};
	if(!req.session.userInfo) {
		if(req.session._id) {
			db = dbService.getDb();
			db.collection("sessions").remove({"_id": req.session._id}, function(err, result) {
				if(err)	console.log(err);
				objSession.SESSION_TIMED_OUT = true;
				res.send(objSession);
			});
		}
		else {
			objSession.SESSION_TIMED_OUT = true;
			res.send(objSession);
		}
	}
	else {
		next();
	}
	
}

function checkIfCompanyExist(req, res, next) {
	const companyURL = (req.subdomains.length > 0) ? req.subdomains[0] : '';
	if(companyURL) {
		commonService.checkIfCompanyExist(companyURL).then(function(company) {
			if(company) {
				next();
			}
			else {
				let apiFailureResponse = apiResponse.setFailureResponse("Unauthorized access.");
				res.json(apiFailureResponse).end();
			}
		})
		.catch(function(err){
			let apiFailureResponse = apiResponse.setSystemFailureResponse(err);
            res.json(apiFailureResponse).end();
		});
	}
	else {
		let apiFailureResponse = apiResponse.setFailureResponse("Invalid company Name in URL.");
		res.json(apiFailureResponse).end();
	}
}

async function checkIfFeatureActive(req,res,next) {
    try {
    	const db = dbService.getDb();
    	const companyURL = (req.subdomains.length > 0) ? req.subdomains[0] : '';
    	const accessUrl = req.originalUrl;
    	const accessModule = await bindModuleName(accessUrl);
        const result = await commonService.checkIfFeatureActive(companyURL,accessModule);
       if(!result) {
   			const apiFailureResponse = apiResponse.setFailureResponse("Unauthorized access.");
			res.json(apiFailureResponse).end();
       }
       next();
    } catch (e) {
       	const apiFailureResponse = apiResponse.setFailureResponse("Unauthorized access.");
		res.json(apiFailureResponse).end();
    }
}

async function bindModuleName(accessUrl) {
	let result = false;
	let urlNames = Object.values(appConfig.URL_CHECK_FEATURE);
	let moduleName = Object.keys(appConfig.URL_CHECK_FEATURE);
	for (const [index,url] of urlNames.entries()) {
		result = accessUrl.includes(url);
		if (result) {
			return moduleName[index].replace('-','');
		}
	}
	return false;
}

async function checkUserPermission(req,res,next) {
    try {
    	if (!req.session.userInfo || (req.session.userInfo && ['Admin', 'User'].indexOf(req.session.userInfo.role) === -1)) {
    		const apiFailureResponse = apiResponse.setFailureResponse("Not authorized to access this resource.");
			res.json(apiFailureResponse).end();
		}
       next();
    } catch (e) {
       	const apiFailureResponse = apiResponse.setFailureResponse("Unauthorized access.");
		res.json(apiFailureResponse).end();
    }
}

async function checkAllPermission(req,res,next) {
    try {
    	if (!req.session.userInfo || (req.session.userInfo && ['Admin', 'User','Supplier'].indexOf(req.session.userInfo.role) === -1)) {
    		const apiFailureResponse = apiResponse.setFailureResponse("Not authorized to access this resource.");
			res.json(apiFailureResponse).end();
		}
       next();
    } catch (e) {
       	const apiFailureResponse = apiResponse.setFailureResponse("Unauthorized access.");
		res.json(apiFailureResponse).end();
    }
}

async function checkUSerAccessRights(req,res,next) {
    try {
    	const accessUrl = req.originalUrl;
    	const accessModule = await bindModuleName(accessUrl);
    	const objRights = await userRightsService.getUserPermissionAgainstAccessedModule(req.session.userInfo.userId, accessModule, req.session.userInfo.role);
    	if (!objRights.everything && !objRights.all) {
    		const apiFailureResponse = apiResponse.setFailureResponse("Not authorized to access this resource.");
			res.json(apiFailureResponse).end();
    	}
    	next();
    } catch (e) {
       	const apiFailureResponse = apiResponse.setFailureResponse("Unauthorized access.");
		res.json(apiFailureResponse).end();
    }
}


async function cache(req, res, next) {
	let key = '__express__' + req.originalUrl || req.url
	let cachedBody = mcache.get(key);
	if (cachedBody) {
		res.send(cachedBody)
		return
	} else {
		res.sendResponse = res.send
		res.send = (body) => {
			mcache.put(key, body, 10 * 1000);
			res.sendResponse(body)
		}
		next()
	}
}

