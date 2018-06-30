var nodemailer = require('nodemailer');
const randomToken = require('random-token');
const Q = require('q');
const appConfig = require('../../appConfig');
const mailConfig = require('../../mailConfig');
const async = require("async");
const api_key = appConfig.API_KEY;
const domain = appConfig.DOMAIN;
const mailgun = require('mailgun-js')({"apiKey": api_key, "domain": domain});

var service = {};
service.sendCustomizedMail = sendCustomizedMail;
module.exports = service;

function sendCustomizedMail(emailTemplate, userAccountInfo, mailInfo) {
	var deferred = Q.defer();
	var generatedEmailVerifyToken = randomToken(16);
	mailInfo['generatedEmailVerifyToken'] = generatedEmailVerifyToken;
	var mailSendFrom = mailInfo.mailSendFrom || appConfig.SUPER_ADMIN_EMAIL;
	var mailSendTo = mailInfo.mailSendTo;

	getDataFromConfig(mailInfo, emailTemplate, 'link').then(function(objLink) {
			userAccountInfo['link'] = objLink;
			getDataFromConfig(userAccountInfo, emailTemplate, 'template').then(function(objTemplate) {
				// Mail body for company user confirmation mail
				var mailOptions = {
					from: '', // sender address
					to: mailSendTo,
					subject: mailConfig.EMAIL_SUBJECT[emailTemplate] || mailInfo.subject,
					html: objTemplate || (mailInfo.message || ''),
				};

				mailgun.messages().send(mailOptions, function(error, body) {
					if (error) {
						console.log(error, 'error')
						return deferred.reject(error);
					}

					deferred.resolve({
						"success": true,
						"message": 'Message sent: ',
						"id": body.id,
						"data": {
							"generatedEmailVerifyToken": generatedEmailVerifyToken
						}
					});
				})
			}).catch((err) => {
				return deferred.reject(error);
			});
		})
		.catch((err) => {
			return deferred.reject(error);
		});
	return deferred.promise;
}

async function getDataFromConfig(mailInfo, emailTemplate, type) {
	try {
		var keys = Object.keys(mailInfo);
		if (type == 'link')
			var data = mailConfig.EMAIL_LINKS[emailTemplate];
		else
			var data = mailConfig.EMAIL_TEMPLATE[emailTemplate];

		if (keys.length > 0 && data) {
			for (const val of keys) {
				data = replaceAll(data, "{{" + val + "}}", mailInfo[val]);
			}
			return data;
		} else {
			return '';
		}
	} catch (e) {
		throw e;
	}
}

function replaceAll(str, find, replace) {
	find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	return str.replace(new RegExp(find, 'g'), replace);
}