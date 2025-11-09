const mongoose = require('mongoose');
const config = require("config");
const debug = require("debug")("development: mongoose")

mongoose.connect(`${config.get("MONGODB_URI")}/main`)
    .then(function () {
        debug("connected");
    })
    .catch(function (err) {
        debug(err);
    })

module.exports = mongoose.connection;