const Rate = require("../Models/Rates.js");
const User = require("../Models/user.js");
const { ERRORS } = require("../Constant/index.js")


const totalRates = async (req, res, next) => {



    const { aluminum, aluminum1, user_id } = req.body;
    const user = await User.findById(user_id);
    if (!user) {
        return next(ERRORS.SOMETHING_WRONG)
    }

    try {
        const ress = new Rate(req.body)
        const a = await ress.save();

        res.send({ status: true, data: a });
    } catch (e) {
        console.log(e)
        return next(ERRORS.SOMETHING_WRONG)
    }

}

module.exports = totalRates;