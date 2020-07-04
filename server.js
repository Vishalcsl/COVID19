const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const cors = require("cors");


const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

//middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static files
app.use(express.static('client/build'));
app.get('*', (req, res) => {
    //console.log(path.join(__dirname, './client/build/index.html'));
    res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

//database connection
const db = require("./app/models");
const password = 'devarsh@mongo';
const databaseUrl = `mongodb+srv://devarsh:${password}@cluster0.akfpy.mongodb.net/covid?retryWrites=true&w=majority`;
console.log(databaseUrl);
db.mongoose.connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log("Error while connecting the data base");
        process.exit();
    })



//basic route to test 
app.get("/", (req, res) => {
    res.json({ message: "Hey there!!, glad you found me out" });
})

//routes
require('./app/routes/main.route.js')(app);

//basic configuration
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("I am up");
})