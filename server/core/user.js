const bcrypt = require('bcrypt');
const User = require('../models/user');
const _ = require('underscore');

let create = (body) => {
    return new Promise((resolve, reject) => {
        let user = new User({
            name: body.name,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role
        });
        user.save((err, userDb) => {
            if (err) {
                resolve({
                    code: 400,
                    data: {
                        ok: false,
                        err
                    }
                });
                return;
            }
            resolve({
                code: 200,
                data: {
                    ok: true,
                    user: userDb
                }
            });
        });
    });
};

let update = (id, bodyPut) => {
    return new Promise((resolve, reject) => {
        let body = _.pick(bodyPut, ['name', 'email', 'img', 'role', 'status']);
        let options = { new: true, runValidators: true };
        User.findByIdAndUpdate(id, body, options, (err, userDb) => {
            if (err) {
                resolve({
                    code: 400,
                    data: {
                        ok: false,
                        err
                    }
                });
                return;
            }
            if (!userDb) {
                resolve({
                    code: 400,
                    data: {
                        ok: false,
                        err: {
                            message: `User not found for this id: ${id}`
                        }
                    }
                });
                return;
            }
            resolve({
                code: 200,
                data: {
                    ok: true,
                    id,
                    user: userDb
                }
            });
        });
    });
};

let getAll = (getParams) => {
    return new Promise((resolve, reject) => {
        let from = getParams.from || 0;
        let limit = getParams.limit || 5;
        let query = { status: true };
        let fields = 'name email role status google img';
        User.find(query, fields)
            .skip(Number(from)) //this is used for pagination
            .limit(Number(limit)) //this is used for pagination
            .exec((err, users) => {
                if (err) {
                    resolve({
                        code: 400,
                        data: {
                            ok: false,
                            err
                        }
                    });
                    return;
                }
                User.countDocuments(query, (err, count) => {
                    resolve({
                        code: 200,
                        data: {
                            ok: true,
                            count,
                            users
                        }
                    })
                });
            });
    });
};

let remove = (id) => {
    return new Promise((resolve, reject) => {
        // User.findByIdAndRemove(id, (err, userDeleted) => {
        let fields = { status: false };
        let options = { new: true };
        User.findByIdAndUpdate(id, fields, options, (err, userDeleted) => {
            if (err) {
                resolve({
                    code: 400,
                    data: {
                        ok: false,
                        err
                    }
                });
                return;
            }
            if (!userDeleted) {
                resolve({
                    code: 400,
                    data: {
                        ok: false,
                        err: {
                            message: 'User not found'
                        }
                    }
                });
                return;
            }
            resolve({
                code: 200,
                data: {
                    ok: true,
                    userDeleted
                }
            })
        });
    });
};

let login = () => {
    return new Promise((resolve, reject) => {
        resolve({
            code: 200,
            data: {
                ok: true
            }
        });
    });
};


module.exports = {
    create,
    update,
    getAll,
    remove,
    login
};