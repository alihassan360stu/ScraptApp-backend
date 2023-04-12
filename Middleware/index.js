const User = require("../Models/user.js")
const Plan = require("../Models/UpgradePlan.js")
const { decrypt } = require("../Utils/encript.js")

const AythMiddle = () => [
    async (req, res, next) => {
        if (!req.headers.authorization) {
            return next({ status: false, message: "unauthorized" })
        }
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return next({ status: false, message: "unauthorized" })
        }
        const compare = await decrypt(token).catch((e) => {
            console.log("the error is ", e)
        })

        if (!compare) {
            return next({ status: false, message: "unauthorized" })
        }
        return next();
    }
]


const subPlan = () => [
    async (req, res, next) => {
        const user = await User.findOne({ _id: req.body.userId });


        console.log("the user is", user)

        if (user && user.subsribe === true) {
            var plan = await Plan.find({ _id: user.subsribe_id });

            if (plan) {
                var year = new Date(plan[0].created_at).getFullYear()
                var months = new Date(plan[0].created_at).getMonth() + 1
                var date = new Date(plan[0].created_at).getDate()
                var currentDate = new Date().getDate()
                var currentYear = new Date(plan[0].created_at).getFullYear()
                var currentMoths = new Date().getMonth() + 1
                if (currentYear >= year + plan[0].plane && months === currentMoths && date === currentDate) {
                    await PostOrder.findOneAndRemove({ _id: user[0]._id });
                    await User.updateOne({ _id: req.body.userId }, { $set: { 'subsribe': false } })
                    await User.updateOne({ _id: req.body.userId }, { $set: { 'subsribe_id': null } })

                } else {

                    

                }
            }

        }
        return next();
    }
]

module.exports = { AythMiddle, subPlan }