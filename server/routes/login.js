const express = require('express');
const app = express();
const loginCore = require('../core/login');

app.post('/login', (req, res) => {
    let body = req.body;
    loginCore.login(body)
        .then(response => res.status(response.code).json(response.data))
        .catch(error => res.status(400).json({ ok: false, error }));

});

module.exports = app;