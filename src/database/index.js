require('dotenv').config();
const mongoose = require('mongoose');

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
    mongoose.connect(process.env.URL_MONGO_DEV/* , options */).then(
        () => {
            console.log("Success connect to: forSaleDatabase");
        },
        err => {
            console.log("Error connect to: forSaleDatabase" + err);
        }
    );
}

connectWithRetry();
module.exports = mongoose;