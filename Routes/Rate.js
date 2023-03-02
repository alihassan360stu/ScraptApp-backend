const express = require("express").Router();
const Data = require("../Controller/Rates.js");


express.post("/Rates", Data);

module.exports = express;