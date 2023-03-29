const express = require("express").Router();
const { review,fetchReview } = require("../Controller/Review.js");
const { AythMiddle } = require("../Middleware/index.js")
express.post("/add", review);
express.post("/fetch", fetchReview);
module.exports = express;