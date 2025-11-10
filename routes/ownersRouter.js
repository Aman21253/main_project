const express = require('express');
const router = express.Router();
const ownerModel = require("../models/ownerModel")

router.get("/", function (req, res) {
    res.send("Hey Working");
})

if (process.env.NODE_ENV === 'development') {
    router.post("/create", async function (req, res) {
        let owners = await ownerModel.find();
        // res.send("Hey Working");
    })
}


module.exports = router;