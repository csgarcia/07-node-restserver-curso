const Category = require('../models/category');
const _ = require('underscore');

let create = (body, createdBy) => {
    return new Promise((resolve, reject) => {
        let category = new Category({
            name: body.name,
            description: body.description,
            user: createdBy
        });
        category.save((err, categoryDb) => {
            if (err) {
                resolve({
                    code: 400,
                    data: { ok: false, err }
                });
                return;
            }
            resolve({
                code: 200,
                data: { ok: true, user: categoryDb }
            });
        });
    });
};

let update = (id, body, updatedBy) => {
    return new Promise((resolve, reject) => {
        let _body = _.pick(body, ['name', 'description']);
        let options = { new: true, runValidations: true };
        _body.user = updatedBy;
        Category.findByIdAndUpdate(id, _body, options, (err, categoryDb) => {
            if (err || !categoryDb) {
                resolve({
                    code: 400,
                    data: {
                        ok: false,
                        err: err || {
                            message: `Category not found for this id: ${id}`
                        }
                    }
                });
                return;
            }
            resolve({
                code: 200,
                data: { ok: true, id, category: categoryDb }
            });
        });
    });
};

let getAll = () => {
    return new Promise((resolve, reject) => {
        let fields = 'name description user';
        Category
            .find({}, fields)
            .sort('name')
            .populate('user', 'name email') //Joins reference to other collections
            .exec((err, categories) => {
                if (err) {
                    resolve({
                        code: 400,
                        data: { ok: false, err }
                    });
                    return;
                }
                resolve({
                    code: 200,
                    data: { ok: true, categories }
                });
            });
    });
};

let getById = (id) => {
    return new Promise((resolve, reject) => {
        let fields = 'name description user';
        Category.findById(id, fields, (err, categoryDb) => {
            if (err || !categoryDb) {
                resolve({
                    code: 400,
                    data: {
                        ok: false,
                        err: {
                            message: `Category not found for this id: ${id}`
                        }
                    }
                });
                return;
            }
            resolve({
                code: 200,
                data: { ok: true, category: categoryDb }
            });
        });
    });
};

let remove = (id) => {
    return new Promise((resolve, reject) => {
        Category.findByIdAndRemove(id, (err, categoryRemoved) => {
            if (err || !categoryRemoved) {
                resolve({
                    code: 400,
                    data: {
                        ok: false,
                        err: {
                            message: `Cannot remove category with this id: ${id}`
                        }
                    }
                });
                return;
            }
            resolve({
                code: 200,
                data: { ok: true, category_removed: categoryRemoved }
            });
        })
    });
};

module.exports = {
    create,
    update,
    getAll,
    getById,
    remove
};