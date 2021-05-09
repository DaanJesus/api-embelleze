require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const app = express();
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('./swaager.json');

const SERVER_PORT = Number(process.env.SERVER_PORT || 5000)
let host = `localhost:${SERVER_PORT}`;
let _schemas = "http"

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument, {
    explorer: true
}))

mongoose.connect(process.env.URL_MONGO, { useUnifiedTopology: true}).then(
    () => {
        console.log("Success connect to: forSaleDatabase", host);
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

app.use(express.json());

app.get('/', async (req, res) => {
    res.redirect('/api-docs')
})

app.get('/resete_senha', async (req, res) => {
    res.render("../app/views/resete_senha");
});

app.get('/uploads', async (req, res) => {
    res.render("../app/views/upload_images");
});

require('./app/controller/index')(app);

app.listen(process.env.PORT || 5000);