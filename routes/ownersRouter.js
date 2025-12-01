const express = require('express');
const router = express.Router();
const ownerModel = require("../models/ownerModel")

router.get("/", function (req, res) {
    res.send("Hey its Working");
})

if (process.env.NODE_ENV === 'development') {
    router.post("/create", async function (req, res) {
        let owners = await ownerModel.find();
        if (owners.length > 0) {
            return res
                .send(503)
                .send("You dont have permission becz owner exists");
        }

        let { fullName, email, password } = req.body;
        let createdOwner = await ownerModel.create({
            fullName,
            email,
            password,
        });
        res.status(201).send(createdOwner);
    })
}

module.exports = router;