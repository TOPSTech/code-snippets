const express = require('express');
const subdomain = require('express-subdomain');
const https = require('https');
const http = require('http');
const appConfig = require('./appConfig');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const app = express();
const helmet = require('helmet');
app.use(helmet());
//app.set('subdomain offset', 3);
const session = require('express-session');
const sharedsession = require("express-socket.io-session");
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const sessionstore = require('sessionstore');
const fs = require('fs');
const mongoUtil = require('./mongoUtil');
const winston = require('winston');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.static('../app'));
app.use(express.static('static/'));

const options = {
  key: fs.readFileSync('etc/ssl/bombyxplm.com.key','ascii'),
  cert: fs.readFileSync('etc/ssl/bombyxplm.com.crt','ascii'),
  ca: fs.readFileSync('etc/ssl/bombyxplm.com.ca-bundle','ascii')
};

const seesionMiddleware = session({
	secret:appConfig.JWT_SECRET,
	resave: true,            
    rolling: true,     
	saveUninitialized:false,
	store: new MongoStore({
		 url: appConfig.MONGO_DB_URL,
		 autoRemove: 'native'
	}),
	cookie: {
		maxAge: 1000 * 60 * 120 // Milliseconds (3600000ms -> 60min)
	}
});
app.use(seesionMiddleware);
//To set html files as view engine
const cons = require('consolidate');
app.engine('html', cons.swig)
app.set('views', path.join(process.env.PWD, 'views'));
app.set('view engine', 'html');

app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;
		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return msg;
	}
}));

app.all(['/images/*','/pdfs/*','/development-order/*'], function(req, res, next) {
	if (!req.session.userInfo) {
		res.send({
			'SESSION_TIMED_OUT': false
		});
	}
	next();
})

app.use('/api', expressJwt({ secret: appConfig.JWT_SECRET, credentialsRequired: true }).unless({
		path: [
            '/api/order-forum/supplier/comment',
            '/api/order-forum/supplier/discussion',
		]
	})
);
mongoUtil.coonectToMongooseDbServer();
mongoUtil.connectToDBServer( function( err ) {
app.use('/api/order-forum',require('./controllers/development-orders/order-forum.controller'));

const httpServer = http.createServer(app);
const server = httpServer.listen(8011,function() {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});

 const io = require('socket.io')(server,{ path: '/socket.io'});

   const socketIOHelper = require('./services/notification/socketio.service')(io);
   
  // start the rest of your app here
});

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error_log/combined.log' })
  ]
});

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
	mongoUtil.disconnectDataBase();
  logger.log('error', err, 'my string');
});
  
  
