require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const path = require('path')
//const mongoose = require('./database/index')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan("dev"));
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));

//mongoose.connect();

app.set('view engine', 'ejs');

app.get('/resete_senha', async (req, res) => {
    res.render("../resources/mail/auth/resete_senha");
});

app.get('/uploads', async (req, res) => {
    res.render("../resources/mail/auth/upload_images");
});

require('./app/controller/index')(app);

app.listen(8080);