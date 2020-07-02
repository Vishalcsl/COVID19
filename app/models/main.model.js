const mongoose = require('mongoose');

const Survey = mongoose.model(
    "Survey",
    new mongoose.Schema({
        fullname: String,
        email: String,
        permanentAddress: String,
        currentAddress: String,
        state: String,
        district: String,
        city: String,
        zip: Number,
        phoneNumber: Number,
        aadharNumber: Number,
        internationalTravel: String,
        nationalTravel: String
    })
);

module.exports = Survey;