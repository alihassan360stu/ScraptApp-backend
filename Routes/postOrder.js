const express = require("express").Router();
const multer = require("multer")
const { ERRORS } = require("../Constant/index.js");
const PostOrder = require("../Models/PostOrder.js");
const User = require("../Models/user.js")
const { AythMiddle } = require("../Middleware/index.js")



function fileFilter(req, file, cb) {
    const type = file.mimetype.split("/")[1]
    if (type === "jpg" || type === "jpeg") {
        cb(null, true);
    } else {
        cb(new Error('Only jpg and jpeg formate image is acceptable!'));
    }
}
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + file.fieldname + ".jpg");
    }
});

const upload = multer({ storage: storage, limits: { fileSize: 6000000 }, fileFilter })
express.post("/upload", AythMiddle(), upload.array("images"), async (req, res, next) => {
    var images = [];
    if (Array.isArray(req.files) && req.files.length !== 0) {
        req.files.map((value) => {
            images.push({ filename: value.filename, originalname: value.originalname })
        })
    }

    if (req.body.quantity < 0 || req.body.quantity > 100) {
        return next({ status: false, success: false, message: "quantity range 1 to 100 please chect it" });
    }
    const dataSaveToDatabase = { ...req.body, "images": images };
    var response;
    response = await PostOrder.create(dataSaveToDatabase);

    if (!response) {
        return next(ERRORS.SOMETHING_WRONG)
    }
    res.send({ data: response, status: true, message: "post added successfully" });
});


express.post("/fetch", AythMiddle(), async (req, res, next) => {

    var postUser;
    if (!req.body.userId) {
        return next(ERRORS.MISSING_PARAMS);
    }

    try {
        postUser = await PostOrder.find({ userId: req.body.userId });
        console.log("the user ", postUser);
        if (!postUser) {
            console.log("data not found");
            return next({ status: false, success: false, message: "Data Not Found" })
        }
    } catch (e) {
        console.log(e)
        return next(ERRORS.SOMETHING_WRONG)
    }
    // PostOrder

    res.send({
        status: true,
        success: true,
        message: "Data Found",
        data: postUser
    })
})

express.post("/delete",AythMiddle(), async (req, res, next) => {

    var postUser;
    if (!req.body.postId) {
        return next(ERRORS.MISSING_PARAMS);
    }

    try {
        postUser = await PostOrder.findOneAndRemove({ _id: req.body.postId });
        console.log("the user ", postUser);
        if (!postUser) {
            console.log("data not found");
            return next({ status: false, success: false, message: "Data Not Found" })
        }
    } catch (e) {
        console.log("error", e)
        return next(ERRORS.SOMETHING_WRONG)
    }
    // PostOrder
    res.send({
        status: true,
        success: true,
        message: "Data Found",
        data: postUser
    })
})



express.get("/all",AythMiddle(), async (req, res, next) => {

    var postUser;
    try {
        postUser = await PostOrder.find();
        console.log("the user ", postUser);
        if (!postUser) {
            console.log("data not found");
            return next({ status: false, success: false, message: "Data Not Found" })
        }
    } catch (e) {
        console.log("error", e)
        return next(ERRORS.SOMETHING_WRONG)
    }
    // PostOrder
    res.send({
        status: true,
        success: true,
        message: "Data Found",
        data: postUser
    })
})

module.exports = express;