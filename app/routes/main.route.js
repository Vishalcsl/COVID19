const mainController = require("../controllers/main.controller");

module.exports = function (app) {

    app.post("/api/survey", mainController.surveyController)
}