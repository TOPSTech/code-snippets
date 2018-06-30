const EMAIL_TEMPLATE = {
	'USER_ACCOUNT_CONFIRMATION': "<b>Hello,</b><br><br><b>{{firstName}} {{lastName}} </b> has registered under <b> {{companyURL}} </b>.Please Click on the link to confirm and activate the account.</b><br><br><center><b><a href={{link}}>Click here to confirm</a></b></center><br><br><b>Regards,</b><br><b>The Bombyx team<b/>",
}
const EMAIL_LINKS = {
	'USER_ACCOUNT_CONFIRMATION': "http://{{reqHost}}/#/user/confirm?id={{userId}}&code={{generatedEmailVerifyToken}}&userEmail={{userEmail}}&companyAdminEmail={{companyAdminMail}}",
}
const EMAIL_SUBJECT = {
	'USER_ACCOUNT_CONFIRMATION': "Account Confirmation Required",
}

const objSetMailConfig = {
	"EMAIL_TEMPLATE": EMAIL_TEMPLATE,
	"EMAIL_LINKS": EMAIL_LINKS,
	"EMAIL_SUBJECT": EMAIL_SUBJECT
};
module.exports = objSetMailConfig;