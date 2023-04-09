const User = require("../Models/user.js");
const UserContact = require("../Models/Contact.js")
const { ERRORS } = require("../Constant/index.js");

const Contact = async (req, res, next) => {
    try {
        const ress = new UserContact(req.body)
        const responce = await ress.save();
        res.send({ status: true, data: responce, message: "Contact Added SuccessFully" });
    } catch (e) {
        console.log(e)
        return next(ERRORS.SOMETHING_WRONG)
    }

}

module.exports = Contact;