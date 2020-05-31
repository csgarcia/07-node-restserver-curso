require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); // app.use is a middleware, basically functions that will executed when code passes on here
// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/user'));

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: ${process.env.PORT}`);
    mongoose.connect(process.env.URL_DB, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(res => {
        // console.log(res);
        console.log(`Database ONLINE`);
    }).catch(err => {
        console.log(err);
    });
});