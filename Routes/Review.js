const express = require("express").Router();
const { review } = require("../Controller/Review.js");
const { AythMiddle } = require("../Middleware/index.js")
express.post("/add", review);
module.exports = express;