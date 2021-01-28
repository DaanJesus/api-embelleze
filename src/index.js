require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express();

mongoose.connect(process.env.URL_MONGO).then(
        () => {
            console.log("Success connect to: forSaleDatabase");
        },
        err => {
            console.log("Error connect to: forSaleDatabase" + err);
        }
    );

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan("dev"));
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));


app.set('view engine', 'ejs');

app.get('/resete_senha', async (req, res) => {
    res.render("../resources/mail/auth/resete_senha");
});

app.get('/uploads', async (req, res) => {
    res.render("../resources/mail/auth/upload_images");
});

require('./app/controller/index')(app);

app.listen(process.env.PORT || 8080);