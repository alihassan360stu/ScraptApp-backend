const { ERRORS } = require("../Constant/index.js")
var jwt = require("jsonwebtoken");
function encrypt(data, options) {
    return new Promise((resolve, reject) => {
        jwt.sign({ id: data._id, email: data.email, name: data.firstname }, process.env.PRIVATE_KEY, options, function (err, token) {
            if (err) {
                console.log("error", err)
                reject(false)
            }
            if (token) {
                resolve(token)
            }
        });


    })
}



module.exports = encrypt;