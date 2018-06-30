/********** REQUIRE SECTION START ***********/
const mongodb = require('mongodb');
const mongoClient = require('mongodb').MongoClient;
const Q = require('q');
const commonService = require('../shared/common.service');
const commonMailService= require('../shared/common-mail.service');
const appConfig = require('../../appConfig');
const async = require("async");
const commonEmitter = commonService.commonEmitter;
/********** REQUIRE SECTION END **********/

/********** PRIVATE VARIABLES START **********/
const service = {};
/********** PRIVATE VARIABLES END **********/

/********** SET SERVICE OBJECT START **********/
service.saveDiscussion = saveDiscussion;
service.getDiscussion = getDiscussion;
service.retrieveDiscussionById = retrieveDiscussionById;
service.retrieveOrderCodes = retrieveOrderCodes;
service.retrieveMainCategoryDiscussionCount = retrieveMainCategoryDiscussionCount;
service.retrieveSubCategoryDiscussionCount = retrieveSubCategoryDiscussionCount;
/********** SET SERVICE OBJECT END **********/

/********** EXPORTS SERVICE MODULE **********/
module.exports = service;

/********** BINDABLE FUNCTIONS START **********/
async function saveDiscussion(objDiscussion) {
    const db = await mongoClient.connect(appConfig.MONGO_BASE_URL_WITHOUT_DB + objDiscussion.companyURL);
    try {
        // Define collection
        const userId = objDiscussion.supplierUserId ? objDiscussion.supplierUserId : objDiscussion.loggedInUserId;
        // const checkIfFeatureActive = await commonService.checkIfFeatureActive(objDiscussion.companyURL,'forum');
        const orderForum = db.collection('OrderForum');
        const objInsert = {
            devOrderId: objDiscussion.devOrderId,
            title: objDiscussion.title,
            mainCategory: JSON.parse(objDiscussion.mainCategory),
            subCategory: objDiscussion.subCategory,
            code: objDiscussion.code,
            content: objDiscussion.content,
            readBy: [],
            attachments: objDiscussion.attachments || [],
            createdBy: userId,
            createdAt: new Date()
        }
        const doc = await orderForum.insert(objInsert);
        commonEmitter.emit('createNotification',{companyURL:objDiscussion["companyURL"],createdBy:userId, devOrderId: objDiscussion.devOrderId,action:'add',module:'Forums'});
        return doc;
    } finally {
        db.close();
    }
}

async function getDiscussion(objDiscussion) {
    const db = await mongoClient.connect(appConfig.MONGO_BASE_URL_WITHOUT_DB + objDiscussion.companyURL);
    try {
        // Define collection
        // const checkIfFeatureActive = await commonService.checkIfFeatureActive(objDiscussion.companyURL,'forum');
        const orderForum = db.collection('OrderForum');
        const orderForumComment = db.collection('OrderForumComments');
        const findQuery = { devOrderId: objDiscussion.devOrderId };
        if (Number(objDiscussion['myDiscussion']) === 1)
            findQuery['createdBy'] = objDiscussion.loggedInUserId;
        if (objDiscussion['mainCategory']) {
            findQuery['mainCategory.key'] = objDiscussion['mainCategory'];
            if (objDiscussion['subCategory'])
                findQuery['subCategory'] = objDiscussion['subCategory'];
        }
        const doc = await orderForum.find(findQuery).sort({ createdAt: -1 }).toArray();

        const findCountQuery = { devOrderId: objDiscussion.devOrderId };
         const lastComment = await orderForumComment.aggregate([
            { '$match': findCountQuery },
            { $sort: { createdAt: -1 } },
            {
                "$group": {
                    "_id": '$forumId',
                    "comment": {$first:'$comment'},
                    "createdAt": {$first:'$createdAt'},
                    "createdBy": {$first:'$createdBy'}
                }
            },
        ]).toArray();
        const totalCount = await orderForumComment.aggregate([
            { '$match': findCountQuery },
            {
                "$group": {
                    "_id": '$forumId',
                    "count": { "$sum": 1 }
                }
            },
        ]).toArray();
        findCountQuery['readBy'] = { '$nin': [objDiscussion.loggedInUserId] };
        const unReadCount = await orderForumComment.aggregate([
            { '$match': findCountQuery },
            {
                "$group": {
                    "_id": '$forumId',
                    "count": { "$sum": 1 }
                }
            },
        ]).toArray();

        let loggedIds = doc.map(val => val.createdBy).filter((id, index, arr) => id && arr.indexOf(id) === index);
        const commentLoggedIds = lastComment.map(val => val.createdBy).filter((id, index, arr) => id && arr.indexOf(id) === index);
        loggedIds = loggedIds.concat(commentLoggedIds);
        loggedIds = loggedIds.filter((id, index, arr) => id && arr.indexOf(id) === index);
        
        let userName = {};
        if (loggedIds && loggedIds.length) {
            for (id of loggedIds) {
                let name = await commonService.getUserNameById(id,false,true);
                if (name.name.indexOf('undefined') === -1) {
                    userName[id] = name;
                }
                else {
                     let name = await commonService.getSupplierNameById(id,objDiscussion.companyURL,false);
                     userName[id] = {name:name};
                }
            }
        }
        
        return { doc: doc, userName: userName, totalCount: totalCount, unReadCount: unReadCount ,lastComment:lastComment};
    } finally {
        db.close();
    }
}


async function retrieveDiscussionById(objDiscussion) {
    const db = await mongoClient.connect(appConfig.MONGO_BASE_URL_WITHOUT_DB + objDiscussion.companyURL);
    try {
        // Define collection
        const orderForum = db.collection('OrderForum');
       // const checkIfFeatureActive = await commonService.checkIfFeatureActive(objDiscussion.companyURL,'forum');
        const forumId = await commonService.convertIntoObjectId(objDiscussion.forumId);
        const doc = await orderForum.findOne({ _id: forumId });
        if (doc && doc['createdBy'])
            doc['userName'] = await commonService.getUserNameById(doc['createdBy'].toString(),false,true);
        return doc;
    } finally {
        db.close();
    }
}



async function retrieveMainCategoryDiscussionCount(objDiscussion) {
    const db = await mongoClient.connect(appConfig.MONGO_BASE_URL_WITHOUT_DB + objDiscussion.companyURL);
    try {
        // Define collection
        const orderForum = db.collection('OrderForum');
       // const checkIfFeatureActive = await commonService.checkIfFeatureActive(objDiscussion.companyURL,'forum');
        const orderForumComment = db.collection('OrderForumComments');
        const findQuery = { devOrderId: objDiscussion.devOrderId };

        const mainCategoryCount = await orderForum.aggregate([
            { '$match': findQuery },
            {
                "$group": {
                    "_id": '$mainCategory.key',
                    "mainCount": { "$sum": 1 }
                }
            },

        ]).toArray();
        
        return { doc: mainCategoryCount };
    } finally {
        db.close();
    }
}
async function retrieveSubCategoryDiscussionCount(objDiscussion) {
    const db = await mongoClient.connect(appConfig.MONGO_BASE_URL_WITHOUT_DB + objDiscussion.companyURL);
    try {
        // Define collection
        const orderForum = db.collection('OrderForum');
        const orderForumComment = db.collection('OrderForumComments');
        const findQuery = { devOrderId: objDiscussion.devOrderId };
        const subCategoryCount = await orderForum.aggregate([
            { '$match': findQuery },
            {
                "$group": {
                    "_id": '$subCategory',
                    "subCount": { "$sum": 1 }
                }
            },

        ]).toArray();
        return { subCounts: subCategoryCount };
    } finally {
        db.close();
    }
}

