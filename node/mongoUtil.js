const MongoClient = require( 'mongodb' ).MongoClient;
const appConfig   = require('./appConfig');
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
let _db;

module.exports = {
	connectToDBServer: connectToDBServer,
	coonectToMongooseDbServer: coonectToMongooseDbServer,
	getDb: getDb
};

function connectToDBServer(callback){
	/*MongoClient connection pooling : db object will be re-used when new connections to the database are required.*/
	MongoClient.connect(appConfig.MONGO_DB_URL,{poolSize: 10}, function( err, db ) {
		if(err){
			console.log('Unable to connect to MongoDB Server. Error: ' + err);
		}
		_db = db;
		console.log('connected to database :: ' + appConfig.MONGO_DB_URL);
		return callback( err );;
	});
}

async function coonectToMongooseDbServer() {
	return new Promise((resolve) => {


	mongoose.connect(appConfig.MONGO_DB_URL,{ poolSize: 4 },function(err) {
		if(err){
			console.log('Unable to connect to MongoDB Server. Error: ' + err);
		}
		console.log('connected to mongoose database :: ' + appConfig.MONGO_DB_URL);
		resolve(true)
	});
	})
}

function getDb() {
	return _db;
}