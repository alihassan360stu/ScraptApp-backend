const mongoose = require("mongoose");


const user = new mongoose.Schema({
    name: { type: String, require: true },
    contact: { type: Number, require: true },
    password: { type: String, index: true, require: true },
    email: { type: String, index: true, require: true },
    type: { type: Boolean, default: true, require: true }, // false mean normal user true mean junkyard
    rates_id: {
        type: mongoose.Schema.Types.ObjectId,
        // require: true,
        ref: "Rate"
    },
    subsribe: {
        type: Boolean,
        default: false
    },
    subsribe_id: {
        type: String,
    }
})
//

const userAuth = mongoose.model("User", user);
module.exports = userAuth;