const db = require("../models");
const Survey = db.survey;
const syncReq = require("sync-request");

exports.surveyController = function (req, res) {
    const surveyData = new Survey({
        fullname: req.body.fullname,
        email: req.body.email,
        permanentAddress: req.body.permanentAddress,
        currentAddress: req.body.currentAddress,
        state: req.body.state,
        district: req.body.district,
        city: req.body.city,
        zip: req.body.zip,
        phoneNumber: req.body.phoneNumber,
        aadharNumber: req.body.aadhar,
        internationalTravel: req.body.internationalTravel,
        nationalTravel: req.body.nationalTravel
    })

    surveyData.save((err, data) => {
        if (err) {
            res.status(500).send({ message: "Oops some error occured" })
        } else if (data) {
            let districtData = [];
            let stateData = [];
            let totalCase = 0;
            let totalDeath = 0;
            let totalRecovered = 0;
            let districtTotal = 0;
            let districtDeath = 0;
            let districtRecovered = 0;
            console.log(req.body);
            console.log(req.body.state, req.body.district);
            let res1 = syncReq('GET', 'https://covid19-india-adhikansh.herokuapp.com/states');
            //console.log(res1)
            stateData = JSON.parse(res1.getBody('utf8')).state;


            stateData.map((state) => {
                if (state.name === req.body.state) {
                    console.log("yes")
                    totalCase = state.total,
                        totalDeath = state.death,
                        totalRecovered = state.cured
                }
            })



            let res2 = syncReq('GET', 'https://api.covid19india.org/v2/state_district_wise.json');


            districtData = JSON.parse(res2.getBody('utf8'));
            //console.log(districtData);
            districtData.map(value => {
                if (value.state === req.body.state) {
                    value.districtData.map(district => {
                        if (district.district == req.body.district) {
                            console.log("yes")
                            districtTotal = district.confirmed;
                            districtDeath = district.deceased;
                            districtRecovered = district.recovered;
                        }
                    })
                }
            });

            if (stateData !== [] && districtData !== []) {
                console.log(totalCase, districtTotal, totalDeath, districtDeath);
                if (districtTotal == 0) {
                    res.status(200).send({
                        zone: "Green",
                        dangerMeter: 0,
                        safetyMeter: 100
                    })
                    return;
                } else {
                    let percentageTotal = totalCase !== 0 ? (districtTotal / totalCase) * 100 : 0;

                    let percentageDeath = totalDeath !== 0 ? (districtDeath / totalDeath) * 100 : 0;

                    let percentageCured = totalRecovered !== 0 ? (districtRecovered / totalRecovered) * 100 : 0;


                    if (percentageTotal <= 5) {
                        res.status(200).send({
                            zone: "Green",
                            dangerMeter: percentageDeath,
                            safetyMeter: percentageCured,
                            message: "Even if you are green zoned, you need to be careful"
                        })
                        console.log("Green");
                        return;
                    } else if (percentageTotal > 5 && percentageTotal <= 10) {
                        res.status(200).send({
                            zone: "Orange",
                            dangerMeter: percentageDeath,
                            safetyMeter: percentageCured,
                            message: "Be very careful of your surroundings!!"
                        })
                        console.log("Orange");
                        return;
                    } else {
                        res.status(200).send({
                            zone: "Red",
                            dangerMeter: percentageDeath,
                            safetyMeter: percentageCured,
                            message: "Don't be outside unless very urgent.It's not a joke you are in redzone !!"
                        })
                        console.log("red");
                        return;
                    }

                }
            }
            else {
                console.log("I am here")
                res.status(500).send({
                    message: "Oops some error occured"
                })
            }

        }
    })
}