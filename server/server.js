require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); // app.use is a middleware, basically functions that will executed when code passes on here

// parse application/json
app.use(bodyParser.json());

//routes
app.use(require('./routes/index'));

// Enable public folder for index.html
app.use(express.static(path.resolve(__dirname, '../public')));

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: ${process.env.PORT}`);
    mongoose.connect(process.env.URL_DB, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then(res => {
        // console.log(res);
        console.log(`Database ONLINE`);
    }).catch(err => {
        console.log(err);
    });
});