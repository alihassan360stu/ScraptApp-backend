const User = require("../Models/user.js");
const Rate = require("../Models/Rates.js");
const bcrypt = require("bcrypt")
const { ERRORS } = require("../Constant/index.js")
const { encrypt } = require("../Utils/encript.js")
const ForgotLinks = require("../Models/Forgot")
const nodemailer = require("nodemailer");
const moment = require('moment');




function generate(n) {
    var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   
    if (n > max) {
        return generate(max) + generate(n - max);
    }
    max = Math.pow(10, n + add);
    var min = max / 10; // Math.pow(10, n) basically
    var number = Math.floor(Math.random() * (max - min + 1)) + min;
    return ("" + number).substring(add);
}


async function sendForgotEmail(data, url) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "Scrapsterremoval@gmail.com", // generated ethereal user
            pass: "yixthwkgdiixnknq", // generated ethereal password
        },
    });

    let info = await transporter.sendMail({
        from: 'Scrapster', // sender address
        to: data.email, // list of receivers
        subject: "ForgotPassword Request from Scrapster", // Subject line
        text: `Please use ${url}/auth/forgotpass?${data.token} to reset your password, this link will expire in 15 minutes, your OTP is ${data.otp}`,
    });
}



function randToken(lettersLength, numbersLength) {
    var j, x, i;
    var result = '';
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var numbers = '0123456789';
    for (i = 0; i < lettersLength; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (i = 0; i < numbersLength; i++) {
        result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    result = result.split("");
    for (i = result.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = result[i];
        result[i] = result[j];
        result[j] = x;
    }
    result = result.join("");
    return result
}



const register = async (req, res, next) => {
    const body = req.body;

    function validateWhiteSpace(val) {

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
const getUser = async (req, res, next) => {

    var userMatch

    try {
        userMatch = await User.aggregate([
            {
                $match: {
                    type: true
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
    } catch (e) {
        console.log(e)
        return next(ERRORS.SOMETHING_WRONG);
    }

    res.send({ data: userMatch, status: true, message: "User Found" })
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

const forgot = async (req, res, next) => {
    try {

        const email = req.body.email;
        if (!email) {
            return res.json(ERRORS.MISSING_PARAMS);
        }

        let ifUserExist = await User.findOne({ email });
        if (!ifUserExist) {
            return res.send({ status: false, message: 'No account found linked with provided email address' });
        }

        try {
            const otp = generate(6);
            const token = randToken(6, 6);
            let data = { token, otp, email }
            await ForgotLinks.create(data);
            await sendForgotEmail(data, req.get('origin'));

            return res.json({
                status: true,
                message: 'An email has been sent to you, please check your email and follow instructions to reset your password',
            });
        } catch (error) {
            return res.json({ status: false, message: error.message })
        }


    } catch (error) {
        console.log(error)
        return res.json(ERRORS.SOMETHING_WRONG)
    }
}

const checkForgotLink = async (req, res, next) => {
    try {

        let { token } = req.body;
        if (token === "") {
            return res.json({ status: false, message: "Missing Params" });
        }
        var dateToCheck = moment().add(15, 'minutes').toDate();

        let result = await ForgotLinks.findOne({ token, expired: false, used: false }).lean().exec()

        if (result) {
            if (moment(result.created_at).isAfter(dateToCheck)) {
                let _id = result._id;
                await ForgotLinks.findOneAndUpdate({ _id }, { $set: { expired: true } }, { upsert: false })
                return res.json({ status: false, message: 'Link Expired' })
            } else {
                return res.json({ status: true, message: 'Valid Reset Link' })
            }
        }
        else {
            return res.json({ status: false, message: 'Invalid Or Expired Reset Link' })
        }
    } catch (error) {
        console.log(error)
        return res.json(ERRORS.SOMETHING_WRONG)
    }
}


const checkOTPandToken = async (req, res, next) => {
    try {

        let { token, otp } = req.body;
        if (token === "" || otp === "") {
            return res.json({ status: false, message: "Missing Params" });
        }


        var dateToCheck = moment().add(15, 'minutes').toDate();
        let result = await ForgotLinks.findOne({ token, expired: false, used: false }).lean().exec()
        if (result) {
            if (moment(result.created_at).isAfter(dateToCheck)) {
                let _id = result._id;
                await ForgotLinks.findOneAndUpdate({ _id }, { $set: { expired: true } }, { upsert: false })
                return res.json({ status: false, message: 'Link Expired' })
            } else {
                if (result.otp == otp) {
                    return res.json({ status: true, message: 'Valid Reset OTP' })
                } else {
                    return res.json({ status: false, message: 'InValid Reset OTP' })
                }
            }
        } else {
            return res.json({ status: false, message: 'Invalid Or Expired Reset Link' })
        }
    } catch (error) {
        console.log(error)
        return res.json(ERRORS.SOMETHING_WRONG)
    }
}




const changeByForgot = async (req, res, next) => {
    try {

        const body = req.body;
        function validateWhiteSpace(val) {

            if (typeof (val) === "boolean") {
                return true
            } else {
                return val.trim().length > 0
            }
        }

        for (const property in body) {// missing params validation       
            if (body[property] === "" || !validateWhiteSpace(body[property])) {
                return next(ERRORS.MISSING_PARAMS)
            } else {

            }

        }

        let { token, email, otp, password } = req.body;
        var dateToCheck = moment().add(15, 'minutes').toDate();
        let result = await ForgotLinks.findOne({ token, expired: false, used: false, email }).lean().exec()
        if (result) {
            let _id = result._id;
            if (moment(result.created_at).isAfter(dateToCheck)) {
                await ForgotLinks.findOneAndUpdate({ _id }, { $set: { expired: true } }, { upsert: false })
                return res.json({ status: false, message: 'Link Expired' })
            } else {
                if (result.otp == otp) {
                    const saltRounds = 10;
                    var salt = await bcrypt.genSalt(saltRounds);
                    password = await bcrypt.hash(password, salt);
                    await User.findOneAndUpdate({ email }, { $set: { password } })
                    await ForgotLinks.findOneAndUpdate({ _id }, { $set: { expired: true, used: true } }, { upsert: false })
                    return res.json({ status: true, message: 'Password Updated' });
                } else {
                    return res.json({ status: false, message: 'InValid OTP' })
                }
            }
        } else {
            return res.json({ status: false, message: `Either Link Is Invalid Or Expired, Or Email Isn't Associated With This URL` })
        }
    } catch (error) {
        console.log(error)
        return res.json(ERRORS.SOMETHING_WRONG)
    }
}






const exp = {
    signin,
    register,
    checkingUser,
    checkForgotLink,
    changePassword,
    forgot,
    checkOTPandToken,
    changeByForgot,
    getUser
}

module.exports = exp;