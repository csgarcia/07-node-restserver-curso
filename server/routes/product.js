const express = require('express');
const app = express();
const { verifyToken } = require('../middlewares/authentication');
const productCore = require('../core/product');

app.get('/products', verifyToken, (req, res) => {
    // devolver todas las categorias
    // use populate for user and category
    // paginated
    let getParams = req.query;
    productCore.getAll(getParams)
        .then(response => res.status(response.code).json(response.data))
        .catch(error => res.status(400).json({ ok: false, error }));
});

app.get('/products/search/:term', verifyToken, (req, res) => {
    let term = req.params.term;
    productCore.getBySearchTerm(term)
        .then(response => res.status(response.code).json(response.data))
        .catch(error => res.status(400).json({ ok: false, error }));
});

app.get('/product', verifyToken, (req, res) => {
    // use populate for user and category
    let id = req.query.id || null;
    productCore.getById(id)
        .then(response => res.status(response.code).json(response.data))
        .catch(error => res.status(400).json({ ok: false, error }));
});

app.post('/products', verifyToken, (req, res) => {
    // guardar quien lo guardo
    let body = req.body;
    let createdBy = req.user._id || null;
    productCore.create(body, createdBy)
        .then(response => res.status(response.code).json(response.data))
        .catch(error => res.status(400).json({ ok: false, error }));
});

app.put('/products/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let updatedBy = req.user._id || null;
    productCore.update(id, body, updatedBy)
        .then(response => res.status(response.code).json(response.data))
        .catch(error => res.status(400).json({ ok: false, error }));
});

app.delete('/products/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let updatedBy = req.user._id || null;
    productCore.remove(id, updatedBy)
        .then(response => res.status(response.code).json(response.data))
        .catch(error => res.status(400).json({ ok: false, error }));
});


module.exports = app;