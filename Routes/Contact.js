const Contact = require("../Controller/Contact.js")
const express = require("express").Router();
const { AythMiddle } = require("../Middleware/index.js")
express.post("/contact", AythMiddle(), Contact);
module.exports = express;