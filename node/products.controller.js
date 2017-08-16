var express = require('express');
var router =  express.Router();

var apiResponse    = require('../apiResponse'); //to send a structured response for every api
var validateFields = require('../validate'); //to validate api fields 
var appConfig      = require('../appConfig'); //application config file
var middlewares    = require('../middlewares'); //middleware functions

var productService =  require('../services/products.service');

router.post("/products", middlewares.checkUserSession, addProduct);
router.get('/products', middlewares.checkUserSession, getProducts);
router.put('/products/:pId', middlewares.checkUserSession, editProduct);
router.delete("/products", middlewares.checkUserSession, deleteProduct);

function addProduct(req, res) {
	//adding all the mandatory fields of the form into document object
	var document = {
		field1: req.body.field1,
		field2: req.body.field2
	};

	var validation  = validateFields.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	//adding non mandatory fields into document
	document['field3'] = req.body.field3;
	productService.addProduct(document).then(function(result) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, 'Product Added successfully.', result);
		res.json(apiSuccessResponse).end();
	})
	.catch(function(err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function getProducts(req, res) {
	var document = {
		searchText: req.query.searchText,
		pageIndex: req.query.pageIndex,
		itemsPerPage: req.query.itemsPerPage
	};
	productService.getProducts(document).then(function(result) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200,"Products list", result);
		res.json(apiSuccessResponse).end();
	})
	.catch(function(err){
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

module.exports = router;
