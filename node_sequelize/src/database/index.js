const mongoose = require('mongoose');

try {
    mongoose.connect('mongodb://localhost/admin', {useNewUrlParser: true});
    mongoose.Promise = global.Promise;

    console.log('Connection has been established successfully.');
} catch {
    console.error('Unable to connect to the database: ', error)
}

module.exports = mongoose;