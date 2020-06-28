const express = require('express');
const app = express();
const categoryCore = require('../core/category');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');

app.get('/categories', (req, res) => {
    categoryCore.getAll()
        .then(response => res.status(response.code).json(response.data))
        .catch(error => res.status(400).json({ ok: false, error }));
});

app.get('/category', (req, res) => {
    let getParams = req.query;
    let categoryId = getParams.id || null;
    categoryCore.getById(categoryId)
        .then(response => res.status(response.code).json(response.data))
        .catch(error => res.status(400).json({ ok: false, error }));
});

app.post('/category', verifyToken, (req, res) => {
    let body = req.body;
    let createdBy = req.user._id || null;
    categoryCore.create(body, createdBy)
        .then(response => res.status(response.code).json(response.data))
        .catch(error => res.status(400).json({ ok: false, error }));
    //return category
    //return req.user._id who created the category
});

app.put('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let updatedBy = req.user._id || null;
    categoryCore.update(id, body, updatedBy)
        .then(response => res.status(response.code).json(response.data))
        .catch(error => res.status(400).json({ ok: false, error }));
});

app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;
    categoryCore.remove(id)
        .then(response => res.status(response.code).json(response.data))
        .catch(error => res.status(400).json({ ok: false, error }));
    //conditionms, 
    //check if is admin role, delete the whole category
});

module.exports = app;