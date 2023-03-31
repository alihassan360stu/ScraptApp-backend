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

module.exports = { AythMiddle }