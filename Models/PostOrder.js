const mongoose = require("mongoose");
const post = new mongoose.Schema({
    title: { type: String, require: true },
    discription: { type: String },
    customerType: { type: String, require: true },
    email: { type: String, require: true },
    name: { type: String, require: true },
    fAddress: { type: String, require: true },
    nAddress: { type: String, require: true },
    city: { type: String, require: true },
    quantity: { type: Number, require: true },
    suggested: { type: Number, require: true },
    images: { type: [], require: true },
    contact: { type: Number, require: true },
    MaterialType: { type: [], require: true },
    userId: { type: String, require: true },
})


const PostOrder = mongoose.model("Orders", post);
module.exports = PostOrder;