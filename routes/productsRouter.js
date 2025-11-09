const express = require('express');
const router = express.Router();
const productModel = require("../models/productModel")

router.get("/", function (req, res) {
    res.send("Hey Working");
})

module.exports = router;