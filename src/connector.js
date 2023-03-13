
//const mongodb = require('mongodb');

// const mongoURI = "mongodb://localhost:27017" + "/covidtally"
    // "start": "node ./src/index.js",

const mongoURI = "mongodb://127.0.0.1:27017" + "/covidtally"
let mongoose = require('mongoose');
 
const { tallySchema } = require('./schema')


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("connection established with mongodb server online"); })
    .catch(err => {
        console.log("error while connection", err)
    });
collection_connection = mongoose.model('covidtally', tallySchema)


exports.connection = collection_connection; 
