require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');

const app = express();
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Api for Sale",
            desciption: "Customer API Information",
            contact: {
                name: "Danilo Jesus"
            },
            servers: ["https://apiforsale-backend.herokuapp.com/"]
        }
    },
    apis: ["index.js"]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.set('view engine', 'ejs');

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