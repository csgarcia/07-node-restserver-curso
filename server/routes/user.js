const express = require('express');
const app = express();
const userCore = require('../core/user');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');

app.get('/user', verifyToken, (req, res) => {
    let getParams = req.query;
    userCore.getAll(getParams)
        .then(response => res.status(response.code).json(response.data))
        .catch(error => res.status(400).json({ ok: false, error }));
});

app.post('/user', [verifyToken, verifyAdminRole], (req, res) => {
    let body = req.body; //body-parser will parse this or any payload when it came on request
    userCore.create(body)
        .then(response => res.status(response.code).json(response.data))
        .catch(error => res.status(400).json({ ok: false, error }));
});

app.put('/user/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;
    let body = req.body; //body-parser will parse this or any payload when it came on request
    userCore.update(id, body)
        .then(response => res.status(response.code).json(response.data))
        .catch(error => res.status(400).json({ ok: false, error }));
});

app.delete('/user/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;
    userCore.remove(id)
        .then(response => res.status(response.code).json(response.data))
        .catch(error => res.status(400).json({ ok: false, error }));
});

module.exports = app;