const User = require("../Models/user.js");
const UserReview = require("../Models/Review.js")
const PostOrder = require("../Models/PostOrder")
const { ERRORS } = require("../Constant/index.js");



const review = async (req, res, next) => {

    const { userName, userEmail, comment } = req.body
    if (userName === "" || userEmail === "" || comment == "") {
        return next(ERRORS.MISSING_PARAMS)
    }

    try {
        if (!await PostOrder.findOne({ _id: req.body.postId })) {
            return next(ERRORS.SOMETHING_WRONG)
        }
    }
    catch (e) {
        console.log("error", e);
        return next(ERRORS.SOMETHING_WRONG)
    }
    try {
        const ress = new UserReview(req.body)
        const responce = await ress.save();
        res.send({ status: true, data: responce, message: "Comment Added SuccessFully" });
    } catch (e) {
        console.log(e)
        return next(ERRORS.SOMETHING_WRONG)
    }

}

const rateReview = async (req, res, next) => {

    const { userName, userEmail, comment } = req.body
    if (userName === "" || userEmail === "" || comment == "") {
        return next(ERRORS.MISSING_PARAMS)
    }

    var commentedUser = "";

    try {
        commentedUser = await User.findOne({ _id: req.body.commentedUser })
        if (!commentedUser) {
            console.log("the error 8s ")
            return next(ERRORS.SOMETHING_WRONG)
        }
    }
    catch (e) {
        console.log("error", e);
        return next(ERRORS.SOMETHING_WRONG)
    }


    try {
        const commentAddToDatabase = { ...req.body, "postId": commentedUser._id };
        const ress = new UserReview(commentAddToDatabase)
        const responce = await ress.save();
        res.send({ status: true, data: responce, message: "Comment Added SuccessFully" });
    } catch (e) {
        console.log(e)
        return next(ERRORS.SOMETHING_WRONG)
    }

}

const fetchRateReview = async (req, res, next) => {

    if (!req.body.commentedUser) {
        return next(ERRORS.MISSING_PARAMS)
    }

    var data;

    try {
        data = await UserReview.find({ postId: req.body.commentedUser })
        if (!data) {
            return next(ERRORS.SOMETHING_WRONG)
        }
    }
    catch (e) {
        console.log("error", e);
        return next(ERRORS.SOMETHING_WRONG)
    }
    res.send({ status: true, data: data, message: "Data Found" });

}


const fetchReview = async (req, res, next) => {

    if (!req.body.postId) {
        return next(ERRORS.MISSING_PARAMS)
    }

    var data;

    try {
        data = await UserReview.find({ postId: req.body.postId })
        if (!data) {
            return next(ERRORS.SOMETHING_WRONG)
        }
    }
    catch (e) {
        console.log("error", e);
        return next(ERRORS.SOMETHING_WRONG)
    }
    res.send({ status: true, data: data, message: "Data Found" });

}

module.exports = { review, fetchReview, rateReview, fetchRateReview };