/**********LOCAL IMAGE UPLOAD PATH**********/

const JWT_SECRET = 'test123';
const SUPER_ADMIN_EMAIL = "test@topsinfosolutions.com";
const SUPER_ADMIN_PASSWORD = "test1234";
const SECRET = "test12345";

//Mailgun integration credentials
const API_KEY = "4456446";
const DOMAIN = "test.com";
const dbId = 'test';
const dbPassword = 'test678';
const authDb = 'admin';
/**********SERVER IMAGE UPLOAD PATH**********/
//Base url to access the main database of users and comapany
const MONGO_DB_URL = `mongodb://localhost:27017/test`; 

//This is backend file extention and size check for forum,manual area,pattern,spec and measurement modules
const INVALID_FILE_EXTENTION = "|bat|exe|cmd|sh|php([0-9])?|javascript|pl|cgi|386|dll|com|torrent|js|app|jar|pif|vb|vbscript|wsf|asp|cer|csr|jsp|drv|sys|ade|adp|bas|chm|cpl|crt|csh|fxp|hlp|hta|inf|ins|isp|jse|htaccess|htpasswd|ksh|lnk|mdb|mde|mdt|mdw|msc|msi|msp|mst|ops|pcd|prg|reg|scr|sct|shb|shs|url|vbe|vbs|wsc|wsf|wsh|";
const MAXIMUM_FILESIZE = 5024 * 1024;

const BASE_URL = "http://localhost:8011"

//Status is used for adding status value in development order api
const DEV_ORDER_STATUS = {
	'DEVELOPMENT': 'Development',
	'DEVELOPMENT_DROPPED': 'Development Cancelled',
	'ORDER': 'Order',
	'ORDER_CANCELLED': 'Order Cancelled'
};
const DEV_ORDER_SORT_OPTIONS = {
	'BRAND_ASC': 'Brand (Ascending)',
	'BRAND_DESC': 'Brand (Descending)',
	'SEASON_ASC': 'Season (Ascending)',
	'SEASON_DESC': 'Season (Descending)',
	'PPS_APPROVED_DATE_ASC': 'PPS Approved By Date (Ascending)',
	'PPS_APPROVED_DATE_DESC': 'PPS Approved By Date (Descending)',
	'CARGO_READY_DATE_ASC': 'Cargo Ready Date (Ascending)',
	'CARGO_READY_DATE_DESC': 'Cargo Ready Date (Descending)',
	'GRADINGS_LIBRARY_ASC': 'Gradings Library (Ascending)',
	'GRADINGS_LIBRARY_DESC': 'Gradings Library (Descending)',
}
//This is paypal keys for paypal payment itegration
const PAYPAL_CLIENT_ID = '234234234234234234234';
const PAYPAL_CLIENT_SECRET = '456546546546546546546546546';

//This is object for the url which will be used to detect if feature is active in selected plan of the requested company
const URL_CHECK_FEATURE = {'forum':'order-forum','price':'order-negotiate-price','po':'order-create-po','po-':'po-template-libraries','supplier':'suppliers','supplier':'resend-confirmation-mail'};
const RIGHT_ASSIGNMENT = ['pomLibrary', 'gradingsLibrary', 'specsTemplate', 'patterns', 'masters', 'suppliers', 'archieveTechPack', 'openTechPack', 'trashTechPack', 'deleteTechPack'];
const objSetConfig = {
	"JWT_SECRET": JWT_SECRET,
	"SUPER_ADMIN_EMAIL": SUPER_ADMIN_EMAIL,
	"SUPER_ADMIN_PASSWORD":SUPER_ADMIN_PASSWORD,
	"PAYPAL_MODE":"sandbox",
	"PAYPAL_CLIENT_ID": PAYPAL_CLIENT_ID,
	"PAYPAL_CLIENT_SECRET": PAYPAL_CLIENT_SECRET,
	"INVALID_FILE_EXTENTION": INVALID_FILE_EXTENTION,
	"MAXIMUM_FILESIZE": MAXIMUM_FILESIZE,
	"BASE_URL":BASE_URL,
	"MONGO_DB_URL":MONGO_DB_URL,
	"MONGO_BASE_URL_WITHOUT_DB":MONGO_BASE_URL_WITHOUT_DB,
	"DEV_ORDER_STATUS": DEV_ORDER_STATUS,
	"DEV_ORDER_SORT_OPTIONS": DEV_ORDER_SORT_OPTIONS,
	"SEASONS_STATIC_VALUES": SEASONS_STATIC_VALUES,
	"MAIN_SAMPLES_NAMES": MAIN_SAMPLES_NAMES,
	"OTHER_SAMPLES_NAMES": OTHER_SAMPLES_NAMES,
	"DEFAULT_CATEGORY_NAMES": DEFAULT_CATEGORY_NAMES,
	"API_KEY": API_KEY,
	"DOMAIN": DOMAIN,
	"URL_CHECK_FEATURE": URL_CHECK_FEATURE,
	"RIGHT_ASSIGNMENT": RIGHT_ASSIGNMENT
};
module.exports = objSetConfig;
