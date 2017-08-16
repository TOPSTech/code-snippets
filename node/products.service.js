var Q = require('q');
var appConfig = require('../appConfig');
var service = {};

service.getProducts = getProducts;
service.getArticlesList = getArticlesList;

module.exports = service;

//MySql
function getProducts(getProductsObj) {
	var deferred = Q.defer();
	var startIndex = 0;
	var itemsPerPage = 0;
	if(getProductsObj.pageIndex > 1) {
		startIndex = (getProductsObj.pageIndex - 1) * getProductsObj.itemsPerPage;
	}
	if(getProductsObj.itemsPerPage){
		itemsPerPage = parseInt(getProductsObj.itemsPerPage);	
	}

	var searchText = "'%%'";
	if(getProductsObj.searchText != undefined) {
		searchText = "'%"+getProductsObj.searchText+"%'";
	}
	db.getConnection(function(err, connection) {
		connection.query("select COUNT(*) as count from PRODUCTS where PRODUCTS.NAME LIKE "+ searchText +";", function (error, results, fields) {
			var totalProducts = results[0].count;
			connection.query("select * from PRODUCTS where PRODUCTS.NAME LIKE "+ searchText +" ORDER BY PRODUCTS.PRODUCT_ID DESC LIMIT ?, ?",[startIndex, itemsPerPage], function (error, results, fields) {
				connection.release();
				if (error) {
					return deferred.reject(error);
				}
				if(results) {
					var response = {
						'totalProducts': totalProducts,
						'products': results
					};
					deferred.resolve(response);
					return deferred.promise;
				}
			});
		});
	});
	return deferred.promise;
}

//mongodb
function getArticlesList(getArticlesObj) {
	var deferred = Q.defer();
	var skipArticles;
	var articlesPerPage = appConfig.PAGE_SIZE;
	var findQuery = {};
	if (getArticlesObj.pageIndex && parseInt(getArticlesObj.pageIndex) > 0) {
		skipArticles = (getArticlesObj.pageIndex-1) * articlesPerPage;
	}
	else {
		skipArticles = 0;
		articlesPerPage = 0;
	}
	if (getArticlesObj.reporter) {
		findQuery['reporter'] = getArticlesObj.reporter;
	}
	if (getArticlesObj.category) {
		findQuery['categories'] = getArticlesObj.category;
	}
	if (getArticlesObj.searchText && getArticlesObj.searchText !== '') {
		findQuery['$or'] = [
			{'heading': {'$regex': getArticlesObj.searchText, '$options': 'i'}},
			{'description': {'$regex': getArticlesObj.searchText, '$options': 'i'}}
		]
	}
	var db = mongoClient.getDb();
	db.collection("Articles").find(findQuery).count(function(err, totalArticles) {
		db.collection("Articles").aggregate([
			{
				"$match": findQuery
			},
			{ $sort: { _id: -1 } },
			{ $skip: skipArticles },
			{ $limit: articlesPerPage },
			{
				$lookup:
				{
					from: "Users",
					localField: "reporter",
					foreignField: "_id",
					as: "userInfo"
				}
			},
			{ $project: { 
				articleImage:1,
				heading:1,
				publishScheduleTime:1,
				"userInfo._id":1,
				"userInfo.firstName": 1, 
				"userInfo.lastName": 1,  } 
			}],function(err,articles) {
				if(err) return deferred.reject(err);
				if(articles !== null && articles.length > 0) {
					deferred.resolve({
						message:'Articles found.',
						response: {
							'totalArticles': totalArticles,
							'articlesPerPage': articlesPerPage,
							'articles': articles
						}
					});
				}
				else {
					deferred.resolve({
						message:'Articles found.',
						response: {
							'totalArticles': totalArticles,
							'articlesPerPage': articlesPerPage,
							'articles': []
						}
					});
				}
			});
	});
	return deferred.promise;
}

