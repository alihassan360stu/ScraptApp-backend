const express = require("express").Router();
const { review, fetchReview, rateReview, fetchRateReview } = require("../Controller/Review.js");
const { AythMiddle } = require("../Middleware/index.js")
express.post("/add", AythMiddle(), review);
express.post("/fetch", AythMiddle(), fetchReview);
express.post("/rate", AythMiddle(), rateReview);
express.post("/rate/fetch", AythMiddle(), fetchRateReview);
module.exports = express;