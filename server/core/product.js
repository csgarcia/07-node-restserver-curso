const Product = require('../models/product');
const _ = require('underscore');

let create = (body, createdBy) => {
    return new Promise((resolve, reject) => {
        let product = new Product({
            name: body.name,
            price: body.price,
            description: body.description,
            category: body.category,
            user: createdBy
        });
        product.save((err, productDb) => {
            if (err) {
                resolve({
                    code: 400,
                    data: { ok: false, err }
                });
                return;
            }
            resolve({
                code: 200,
                data: { ok: true, user: productDb }
            });
        });
    });
};

let update = (id, body, updatedBy) => {
    return new Promise((resolve, reject) => {
        let _body = _.pick(body, ['name', 'price', 'description', 'category']);
        let options = { new: true, runValidations: true };
        _body.user = updatedBy;
        Product.findByIdAndUpdate(id, _body, options, (err, productUpdated) => {
            if (err || !productUpdated) {
                resolve({
                    code: 400,
                    data: {
                        ok: false,
                        err: err || {
                            message: `Product not found for this id: ${id}`
                        }
                    }
                });
                return;
            }
            resolve({
                code: 200,
                data: { ok: true, id, product: productUpdated }
            });
        });
    });
};

let getAll = (getParams) => {
    return new Promise((resolve, reject) => {
        let from = getParams.from || 0;
        let limit = getParams.limit || 5;
        let fields = "name price description available";
        Product.find({}, fields)
            .skip(Number(from)) //this is used for pagination
            .limit(Number(limit)) //this is used for pagination
            .populate("category", "name")
            .populate("user", "name email")
            .exec((err, products) => {
                if (err) {
                    resolve({
                        code: 400,
                        data: { ok: false, err }
                    });
                    return;
                }
                resolve({
                    code: 200,
                    data: { ok: true, products }
                });
            });
    });
};

let getBySearchTerm = (term) => {
    return new Promise((resolve, reject) => {

        let regex = new RegExp(term, 'i');

        let fields = "name price description available";
        Product.find({ name: regex }, fields)
            .populate("category", "name")
            .exec((err, products) => {
                if (err) {
                    resolve({
                        code: 400,
                        data: { ok: false, err }
                    });
                    return;
                }
                resolve({
                    code: 200,
                    data: { ok: true, products }
                });
            });
    });
};

let getById = (id) => {
    return new Promise((resolve, reject) => {
        let fields = "name price description available";
        Product.findById(id, fields)
            .populate("category", "name")
            .populate("user", "name email")
            .exec((err, product) => {
                if (err || !product) {
                    resolve({
                        code: 400,
                        data: {
                            ok: false,
                            err: err || { message: `Product not found for this id: ${id}` }
                        }
                    });
                    return;
                }
                resolve({
                    code: 200,
                    data: { ok: true, product }
                });
            });
    });
};

let remove = (id, updatedBy) => {
    return new Promise((resolve, reject) => {
        let options = { new: true, runValidations: true };
        let body = {
            available: false,
            user: updatedBy
        }
        Product.findByIdAndUpdate(id, body, options, (err, productUpdated) => {
            if (err || !productUpdated) {
                resolve({
                    code: 400,
                    data: {
                        ok: false,
                        err: err || {
                            message: `Product not found for this id: ${id}`
                        }
                    }
                });
                return;
            }
            resolve({
                code: 200,
                data: { ok: true, id, product: productUpdated }
            });
        });
    });
};

module.exports = {
    getBySearchTerm,
    create,
    update,
    getAll,
    getById,
    remove
};