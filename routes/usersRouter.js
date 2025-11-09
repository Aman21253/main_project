const express = require('express');
const router = express.Router();
const userModel = require("../models/userModel")

router.get("/", function (req, res) {
    res.send("Hey Working");
})

module.exports = router;