const User = require("../Models/user.js");
const bcrypt = require("bcrypt")
const { ERRORS } = require("../Constant/index.js")
const encrypt = require("../Utils/encript.js")



const register = async (req, res, next) => {

    const body = req.body;
    for (const property in body) {// missing params validation 
        if (body[property] === "lastname" && body[property] === "type" && body[property] === "subuser") {

        } else {

            if (body[property] === "") {
                return next(ERRORS.MISSING_PARAMS)
            }
        }
    }

    const { lastname, firstname, password, address, type, confirm, subuser, email } = req.body;
    if (await User.findOne({ email: body.email })) {
        return next(ERRORS.DUPLICATE_EMAIL)
    }


    if (password !== confirm) {
        return next({ status: false, message: "Invalid Password Please Try Again" })
    }


    var hash;
    try {
        const salt = bcrypt.genSaltSync(10);
        hash = bcrypt.hashSync(password, salt);
    }
    catch (e) {

        console.log("error", e)
        return next(ERRORS.SOMETHING_WRONG);
    }

    var data;


    try {
        const makeUser = new User({
            lastname,
            firstname,
            password: hash,
            address,
            type,
            subuser,
            email
        });

        data = await makeUser.save();
        var token = await encrypt(data, { expiresIn: 80000 });
        return res.status(201).send({ status: 201, message: "user created successfully", data: data, token: token })
    } catch (e) {
        console.log(e)
        return next(ERRORS.SOMETHING_WRONG);
    }

}


const signin = async (req, res, next) => {
    var user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(ERRORS.INVALID_EMAIL_PASSWORD)
    }

    try {
        hash = await bcrypt.compare(req.body.password, user.password);
        if (hash === false) {
            return next(ERRORS.INVALID_EMAIL_PASSWORD)
        }
    }
    catch (e) {
        console.log(e);
        return next(ERRORS.SOMETHING_WRONG)
    }

    var token = await encrypt(user, { expiresIn: 80000 });
    return res.status(201).send({ status: 200, message: "Login successfully", token: token })

}

const exp = {
    signin,
    register
}

module.exports = exp;