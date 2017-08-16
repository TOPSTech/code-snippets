var Q = require('q');
var appConfig = require('../appConfig');
var service = {};

service.getProducts = getProducts;
service.addProduct  = addProduct;

module.exports = service;
