const express = require("express")
const dotenv = require("dotenv");
const apiBase = express();
const mongoDbconnection = require("mongoose")
dotenv.config();
const auth = require("./Routes/user.js")
apiBase.use(express.json());
apiBase.use("/", auth);



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
mongoDbconnection.connect(process.env.DB_URL).then(() => {

    apiBase.listen(process.env.host, () => {
        console.log("login done")
    })
})