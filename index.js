const express = require("express")
const dotenv = require("dotenv");
var path = require('path');
const apiBase = express();
const postUser = require("./Routes/postOrder.js")
const mongoDbconnection = require("mongoose")
dotenv.config();
var cors = require('cors')
const auth = require("./Routes/user.js")
const rate = require("./Routes/Rate.js")
var Review = require("./Routes/Review.js")
var contact = require("./Routes/Contact.js");
var UpgradePlan = require("./Routes/UpgradePlan.js");

apiBase.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});
apiBase.use(express.static(path.join(__dirname, 'public')));
apiBase.use(express.json());
apiBase.use("/", auth)
apiBase.use("/user", rate);
apiBase.use("/review", Review);
apiBase.use("/post", postUser);
apiBase.use("/user", contact);
apiBase.use("/plan", UpgradePlan);
apiBase.use(cors())
apiBase.use((err, res, req, next) => {
    const { status } = err || 500;
    const { message } = err || "some thing went wrong"

    console.log("errrr", err)
    req.json({
        status: status,
        message: message,
        success: "false"
    })
})
// mongoDbconnection.connect("mongodb+srv://alihassan:gjd4st4Dt34DZdEP@cluster0.uavkvl2.mongodb.net/scrapt?retryWrites=true&w=majority",
//     { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {

//         apiBase.listen(process.env.host, () => {
//             console.log("login done")
//         })
//     })


mongoDbconnection.connect("mongodb://localhost:27017/fyp",).then(() => {

    apiBase.listen(process.env.host, () => {
        console.log("login done")
    })
})