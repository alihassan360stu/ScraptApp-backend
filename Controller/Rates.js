const Rate = require("../Models/Rates.js");
const User = require("../Models/user.js");
const { ERRORS } = require("../Constant/index.js");
const totalRates = async (req, res, next) => {
    var i = 1;
    const body = req.body;
    for (const property in body) {// missing params validation       
        if (Math.floor(body[property]) > 0) {
            i++;
        }
    }

    if (i <2) {
        return next({ status: false, message: "Please Enter Itleast one catagory Rates" })
    }

    try {
        const ress = new Rate(req.body)
        const responce = await ress.save();
        res.send({ status: true, data: responce });
    } catch (e) {
        console.log(e)
        return next(ERRORS.SOMETHING_WRONG)
    }

}

module.exports = totalRates;