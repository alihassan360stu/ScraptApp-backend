const express = require("express").Router();
const { AythMiddle } = require("../Middleware/index.js")
const UpgradePlan = require("../Controller/UpgradePlan.js")

express.post("/", AythMiddle(), UpgradePlan);
module.exports = express;