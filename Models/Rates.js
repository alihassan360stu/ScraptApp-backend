const mongoose = require("mongoose");

const rates = new mongoose.Schema({

    aluminum: {
        type: String,
    }
    , sopper: {
        type: String
    },
    srass: {
        type: String
    },
    sead: {
        type: String
    },
    stainless_steel: {
        type: String
    },
    platinum_jewelry: {
        type: String
    },
    used_appliances: {
        type: String
    },
    old_tools: {
        type: String
    },
    computer_parts: {
        type: String
    },
    plastic: {
        type: String
    },
    paper: {
        type: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    }
})


const ra = mongoose.model("Rate", rates)

module.exports = ra;