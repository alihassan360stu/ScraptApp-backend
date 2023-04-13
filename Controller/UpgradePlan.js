const User = require("../Models/user.js");
const Plane = require("../Models/UpgradePlan.js")
const { ERRORS } = require("../Constant/index.js");
const nodemailer = require("nodemailer");



async function sendSubscribedMail(data, url) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "scrapter14@gmail.com", // generated ethereal user
            pass: "mcghgwyzwvhmfpui", // generated ethereal password
        },
    });

    let info = await transporter.sendMail({
        from: 'Scrapster', // sender address
        to: data.email, // list of receivers
        context: { name: data.name },
        subject: "Welcome To Scrapster", // Subject line
        text: `hi ${data.name} ! Thanks for using our services. You have subscribed our ${data.plane_text}`,
    });
}



async function sendMailToMerchent(data, url) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "scrapter14@gmail.com", // generated ethereal user
            pass: "mcghgwyzwvhmfpui", // generated ethereal password
        },
    });

    let info = await transporter.sendMail({
        from: 'Scrapster', // sender address
        to: "usmanghaniuz1999@gmail.com", // list of receivers
        subject: "Upgrade Plan", // Subject line
        text: `You have recived RS (${data.amount})!. ${data.name} has Subscribed your ${data.plane_text} ..  Account Number  ${data.account}`,

    });
}


const UpgradePlan = async (req, res, next) => {
    try {

        var user;
        try {
            user = await User.find({ _id: req.body.userId })
            if (!user) {
                return next(ERRORS.SOMETHING_WRONG)
            }
        } catch (e) {
            console.log(e)
            return next(ERRORS.SOMETHING_WRONG)
        }


        await sendMailToMerchent(req.body);
        await sendSubscribedMail(req.body);
        const ress = new Plane(req.body)
        const responce = await ress.save();

        try {
            const b = await User.updateOne({ _id: req.body.userId }, { $set: { 'subsribe_id': responce._id } })
            if (!b) {
                return next(ERRORS.SOMETHING_WRONG);
            }

        } catch (e) {
            console.log(e)
            return next(ERRORS.SOMETHING_WRONG)
        }
        res.send({ status: true, data: responce, message: "Dear Customer. We are confirming your Plan Upgrade. It can take upto  24 hours. If it is not upgraded within 24 hours contact us through email." });
    } catch (e) {
        console.log(e)
        return next(ERRORS.SOMETHING_WRONG)
    }

}

module.exports = UpgradePlan;