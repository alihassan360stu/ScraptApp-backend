const User = require("../Models/user.js");
const Rate = require("../Models/Rates.js");
const bcrypt = require("bcrypt")
const { ERRORS } = require("../Constant/index.js")
const encrypt = require("../Utils/encript.js")



const register = async (req, res, next) => {
    const body = req.body;

    function validateWhiteSpace(val) {

        console.log(typeof (val))
        if (typeof (val) === "boolean") {
            return true
        } else {
            return val.trim().length > 0
        }
    }

    for (const property in body) {// missing params validation       
        if (property === "rates_id" && body[property] === "") {

        } else {

            if (body[property] === "" || !validateWhiteSpace(body[property])) {
                return next(ERRORS.MISSING_PARAMS)
            } else {

            }
        }
    }

    const { name, password, contact, type, confirm, email, rates_id } = req.body;

    var rates;
    try {
        if (rates_id) {
            rates = await Rate.findById(rates_id);
            if (!rates) {
                return next(ERRORS.SOMETHING_WRONG);
            }
        }
    } catch (e) {
        console.log("error", e);
        return next(ERRORS.SOMETHING_WRONG);
    }





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
            name,
            password: hash,
            type,
            contact,
            email,
            rates_id: rates && rates._id
        });
        data = await makeUser.save();
        let userMatch = await User.aggregate([
            {
                $match: {
                    email
                }

            },
            {
                $lookup: {

                    from: "rates",
                    localField: "rates_id",
                    foreignField: "_id",
                    as: "Rates",

                },

            },
            {
                $project: {
                    "rates_id": 0,
                    "Rates.user_id": 0
                }
            }

        ]);
        var token = await encrypt(data, { expiresIn: 80000 });
        return res.status(201).send({ status: true, message: "user created successfully", data: userMatch, token: token })
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

    let userMatch = await User.aggregate([
        {
            $match: {
                email: req.body.email
            }

        },
        {
            $lookup: {

                from: "rates",
                localField: "rates_id",
                foreignField: "_id",
                as: "Rates",

            },

        },
        {
            $project: {
                "rates_id": 0,
                "Rates.user_id": 0
            }
        }

    ]);

    var token = await encrypt(user, { expiresIn: 80000 });
    return res.status(201).send({ status: true, message: "Login successfully", data: userMatch, token: token })

}

const checkingUser = async (req, res, next) => {
    const body = req.body;
    for (const property in body) {// missing params validation       
        if (property === "rates_id" && body[property] === "") {

        } else {

            if (body[property] === "") {
                return next({ status: false, success: false, message: "Please fill all fields" })
            }
        }
    }
    if (await User.findOne({ email: body.email })) {
        return next(ERRORS.DUPLICATE_EMAIL)
    }


    if (body.password !== body.confirm) {
        return next({ status: false, message: "Invalid Password Please Try Again" })
    }

    return res.status(201).send({ status: true, message: "entry available" })
}

const changePassword = async (req, res, next) => {
    const { old_password, new_password, con_password, email } = req.body;

    if (old_password === "" || new_password === "" || con_password === "") {
        return next(ERRORS.MISSING_PARAMS)
    }
    var user;

    try {
        user = await User.findOne({ email: email });
        if (!user) {
            return next({ status: false, message: "User Not Found Password is incorrect" })
        }
    } catch (e) {
        console.log(e);
        return next(ERRORS.SOMETHING_WRONG)
    }

    var hash;
    try {
        hash = await bcrypt.compare(old_password, user.password);
        if (hash === false) {
            return next({ status: false, message: "Password is incorrect please check it" })
        }
    }
    catch (e) {
        console.log(e);
        return next(ERRORS.SOMETHING_WRONG)
    }

    if (new_password !== con_password) {
        return next({ status: false, message: "Confirm password is incorrect" })
    }

    var passwordHash;
    try {
        const salt = bcrypt.genSaltSync(10);
        passwordHash = bcrypt.hashSync(con_password, salt);
    }
    catch (e) {

        console.log("error", e)
        return next(ERRORS.SOMETHING_WRONG);
    }



    const d = await User.updateOne({
        email: email
    }, { $set: { 'password': passwordHash } })
    if (!d) {
        return next(ERRORS.SOMETHING_WRONG);
    }

    console.log(d);
    return res.status(201).send({ status: true, message: "Password Change Successfully" });
}

const exp = {
    signin,
    register,
    checkingUser,
    changePassword
}

module.exports = exp;