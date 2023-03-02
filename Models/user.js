const mongoose = require("mongoose");


const user = new mongoose.Schema({
    firstname: { type: String, require: true },
    lastname: { type: String, index: true },
    address: { type: String, index: true, require: true },
    password: { type: String, index: true, require: true },
    email: { type: String, index: true, require: true },
    type: { type: Boolean, default: true, require: true }, // false mean normal user true mean junkyard
    subuser: { type: Boolean, default: true }, // false mean home user true office user
    rates_id: {
        type: mongoose.Schema.Types.ObjectId,
        // require: true,
        ref: "Rate"
    }
})


const userAuth = mongoose.model("User", user);
module.exports = userAuth;