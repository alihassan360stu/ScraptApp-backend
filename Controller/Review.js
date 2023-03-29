const User = require("../Models/user.js");
const UserReview = require("../Models/Review.js")
const { ERRORS } = require("../Constant/index.js");



const review = async (req, res, next) => {

    const { userName, userEmail, comment } = req.body
    if (userName === "" || userEmail === "" || comment == "") {
        return next(ERRORS.MISSING_PARAMS)
    }
    try {
        const ress = new UserReview(req.body)
        const responce = await ress.save();
        res.send({ status: true, data: responce });
    } catch (e) {
        console.log(e)
        return next(ERRORS.SOMETHING_WRONG)
    }

}

module.exports = { review };