require('dotenv').config();
const mongoose = require('mongoose');


const URL_MONGO = "mongodb+srv://forSale2021:forSale2021@forsaledatabase.ukynm.mongodb.net/test";

const options = {
    autoIndex: true,
    reconectTries: Number.MAX_VALUE,
    reconectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0,
    keepAlive: true,
    useNewUrlParser: true,
    user: process.env.LOGINDB,
    pass: process.env.PASSWORDDB
}

mongoose.disconnect();
mongoose.Promise = require('bluebird');

const connectWithRetry = () => {
    mongoose.connect(URL_MONGO, options).then(
        () => {
            console.log("Success connect to: " + URL_MONGO);
        },
        err => {
            console.log("Error connect to: " + URL_MONGO + ' - ' + err);
        }
    );
}

connectWithRetry();
module.exports = mongoose;