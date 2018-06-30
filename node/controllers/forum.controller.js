const express = require('express');
const router = express.Router();
const apiResponse = require('../../apiResponse');
const orderForumService = require('../../services/development-orders/order-forum.service');
const commonOrderService = require('../../services/shared/order-common.service');
const validateFn = require('../../validate');
const middlewares = require('../../middlewares');
const commonService  = require('../../services/shared/common.service');
/*--------------Multer File Upload Section Start--------------*/
const multer = require('multer');
const fs = require('fs');
const mkdirp = require('mkdirp');

const orderForumStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        let companyURL;
        let subdomains = req.subdomains;
        if (subdomains) {
            if (subdomains.length > 0) {
                companyURL = subdomains[0];
            }
        }
        commonOrderService.createDirectoryForPdfs(companyURL, req.params.devOrderId,true).then((dir) => {
			cb(null, dir);
		});
    },
    filename: function(req, file, cb) {
        let fileName = file.originalname;
        let n = fileName.lastIndexOf(".");
        fileExtension = fileName.substr(n);
        cb(null, "order_forums_" + new Date().getTime() + fileExtension);
    }
})

const orderForum = multer({
    storage: orderForumStorage
});

// Routes
router.post('/discussion/:devOrderId', [middlewares.usersCurrentSessionHandler, middlewares.checkIfCompanyExist,middlewares.checkIfFeatureActive,middlewares.checkOrderAccess],orderForum.array('files', 10),saveDiscussion);
router.get('/discussion/:devOrderId', [middlewares.usersCurrentSessionHandler, middlewares.checkIfCompanyExist,middlewares.checkIfFeatureActive], getDiscussion);
router.get('/discussion/:devOrderId/:forumId', [middlewares.usersCurrentSessionHandler, middlewares.checkIfCompanyExist,middlewares.checkIfFeatureActive], getDiscussionById);
router.get('/order-codes/:devOrderId', [middlewares.usersCurrentSessionHandler, middlewares.checkIfCompanyExist,middlewares.checkIfFeatureActive], getOrderCodes);
router.get('/category/:devOrderId', [middlewares.usersCurrentSessionHandler, middlewares.checkIfCompanyExist,middlewares.checkIfFeatureActive], getDiscussionByCategory);
router.get('/supplier/discussion',getSupplierDiscussionById);

module.exports = router;

async function saveDiscussion(req, res) {
    const document = {
        devOrderId: req.params.devOrderId,
        title: req.body.title,
        mainCategory: req.body.mainCategory,
        content: req.body.content
    }

    if(document['mainCategory'] && (document['mainCategory'].indexOf('bom') > -1 || document['mainCategory'].indexOf('care') > -1 || document['mainCategory'].indexOf('testing') > -1)) {
         document['subCategory'] = req.body.subCategory;
    }
    /* Document Fields Validation */
    const validation = validateFn.validate(req, res, document);
    if (!validation.success) {
        return res.json(validation).end();
    }
    document['subCategory'] = req.body.subCategory;
    document['code'] = req.body.code;
    const companyURL = (req.subdomains.length > 0) ? req.subdomains[0] : '';

    if(req.files) {
        document['attachments'] = req.files.map(val => {return {name:val.originalname,path:val.path.replace('static/','')}});
    }
    
    if (req.session.userInfo && ['Admin', 'User','Supplier'].indexOf(req.session.userInfo.role) > -1) {
        document["companyURL"] = companyURL;
        document["loggedInUserId"] = req.session.userInfo.userId;
        document['supplierUserId'] = req.session.userInfo.supplierUserId;
        document['reqHost'] = req.get('host');
        try {
            const response = await orderForumService.saveDiscussion(document);
            if (response.result.n === 1 && response.result.ok === 1 && response['insertedIds'][0]) {
                let emailData = await orderForumService.retrieveDevOrderUserEmail(document);
                const reqHost = req.get('host');
                let mailResponse = await orderForumService.sendForumEmail(emailData,reqHost,document['title'],document['devOrderId'],response['insertedIds'][0]);       
                const apiSuccessResponse = apiResponse.setSuccessResponse(200, "BACKEND_CONTROLLER.DISCUSSION_INSERTED", {});
                res.json(apiSuccessResponse).end();
            } else {
                const apiFailureResponse = apiResponse.setFailureResponse("Discussion was not added.");
                res.json(apiFailureResponse).end();
            }
        } catch (e) {
            const apiSystemFailureResponse = apiResponse.setSystemFailureResponse(e.toString());
            res.json(apiSystemFailureResponse).end();
        }
    } else {
        const apiFailureResponse = apiResponse.setFailureResponse("Not authorized to access this resource.");
        res.json(apiFailureResponse).end();
    }
}

async function getDiscussion(req, res) {
    const document = {
        "devOrderId": req.params.devOrderId
    }
    
    /* Document Fields Validation */
    const validation = validateFn.validate(req, res, document);
    if (!validation.success) {
        return res.json(validation).end();
    }
    document['myDiscussion'] = req.query.myDiscussion;
    document['mainCategory'] = req.query.mainCategory;
    document['subCategory'] = req.query.subCategory || '';
    const companyURL = (req.subdomains.length > 0) ? req.subdomains[0] : '';
    if (req.session.userInfo) {
        document["companyURL"] = companyURL;
        document["loggedInUserId"] = req.session.userInfo.userId;
        try {
            const response = await orderForumService.getDiscussion(document);
            const apiSuccessResponse = apiResponse.setSuccessResponse(200, "Forum found successfully.", response);
            res.json(apiSuccessResponse).end();
        } catch (e) {
            const apiSystemFailureResponse = apiResponse.setSystemFailureResponse(e.toString());
            res.json(apiSystemFailureResponse).end();
        }
    } else {
        const apiFailureResponse = apiResponse.setFailureResponse("Not authorized to access this resource.");
        res.json(apiFailureResponse).end();
    }
}

async function getDiscussionById(req,res) {
     const document = {
        "devOrderId": req.params.devOrderId,
        "forumId": req.params.forumId
    }
    
    /* Document Fields Validation */
    const validation = validateFn.validate(req, res, document);
    if (!validation.success) {
        return res.json(validation).end();
    }
    const companyURL = (req.subdomains.length > 0) ? req.subdomains[0] : '';
    if (req.session.userInfo) {
        document["companyURL"] = companyURL;
        document["loggedInUserId"] = req.session.userInfo.userId;
        try {
            const response = await orderForumService.retrieveDiscussionById(document);
            const apiSuccessResponse = apiResponse.setSuccessResponse(200, "Forum found successfully.", response);
            res.json(apiSuccessResponse).end();
        } catch (e) {
            const apiSystemFailureResponse = apiResponse.setSystemFailureResponse(e.toString());
            res.json(apiSystemFailureResponse).end();
        }
    } else {
        const apiFailureResponse = apiResponse.setFailureResponse("Not authorized to access this resource.");
        res.json(apiFailureResponse).end();
    }
}

async function getOrderCodes(req,res) {
    const document = {
        "devOrderId": req.params.devOrderId
    }
    /* Document Fields Validation */
    const validation = validateFn.validate(req, res, document);
    if (!validation.success) {
        return res.json(validation).end();
    }
    const companyURL = (req.subdomains.length > 0) ? req.subdomains[0] : '';
    if (req.session.userInfo) {
        document["companyURL"] = companyURL;
        document["loggedInUserId"] = req.session.userInfo.userId;
        try {
            const response = await orderForumService.retrieveOrderCodes(document);
            const apiSuccessResponse = apiResponse.setSuccessResponse(200, "Forum found successfully.", Object.assign({}, response));
            res.json(apiSuccessResponse).end();
        } catch (e) {
            const apiSystemFailureResponse = apiResponse.setSystemFailureResponse(e.toString());
            res.json(apiSystemFailureResponse).end();
        }
    } else {
        const apiFailureResponse = apiResponse.setFailureResponse("Not authorized to access this resource.");
        res.json(apiFailureResponse).end();
    }
}

async function getDiscussionByCategory(req, res) {
    const document = {
        "devOrderId": req.params.devOrderId,
        "type": req.query.type
    }

    /* Document Fields Validation */
    const validation = validateFn.validate(req, res, document);
    if (!validation.success) {
        return res.json(validation).end();
    }
    
    const companyURL = (req.subdomains.length > 0) ? req.subdomains[0] : '';
    if (req.session.userInfo) {
        document["companyURL"] = companyURL;
        document["loggedInUserId"] = req.session.userInfo.userId;
        try {
            let response;
            if(document.type === 'main') {
                response = await orderForumService.retrieveMainCategoryDiscussionCount(document);
            }
            else {
                response = await orderForumService.retrieveSubCategoryDiscussionCount(document);
            }
            const apiSuccessResponse = apiResponse.setSuccessResponse(200, "Forum found successfully.", response);
            res.json(apiSuccessResponse).end();
        } catch (e) {
            const apiSystemFailureResponse = apiResponse.setSystemFailureResponse(e.toString());
            res.json(apiSystemFailureResponse).end();
        }
    } else {
        const apiFailureResponse = apiResponse.setFailureResponse("Not authorized to access this resource.");
        res.json(apiFailureResponse).end();
    }
}

async function getSupplierDiscussionById(req,res) {
     const document = {
        "devOrderId": req.query.devOrderId,
        "forumId": req.query.forumId,
        "sId": req.query.sId,
        "companyURL": req.query.companyURL
    }
    
    /* Document Fields Validation */
    const validation = validateFn.validate(req, res, document);
    if (!validation.success) {
        return res.json(validation).end();
    }
    
    try {
        let checkIfCompany = await commonService.checkIfCompanyExist(document.companyURL);
        const response = await orderForumService.retrieveDiscussionById(document);
        const apiSuccessResponse = apiResponse.setSuccessResponse(200, "Forum found successfully.", response);
        res.json(apiSuccessResponse).end();
    } catch (e) {
        const apiSystemFailureResponse = apiResponse.setSystemFailureResponse(e.toString());
        res.json(apiSystemFailureResponse).end();
    }
    
}