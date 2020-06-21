const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

let login = (body) => {
    return new Promise((resolve, reject) => {
        User.findOne({ email: body.email }, (err, userFound) => {
            if (err) {
                resolve({
                    code: 500,
                    data: { ok: false, err }
                });
                return;
            }
            if (!userFound || !bcrypt.compareSync(body.password, userFound.password)) {
                resolve({
                    code: 400,
                    data: {
                        ok: false,
                        err: { message: 'Usuario o contraseña incorrectos' }
                    }
                });
                return;
            }

            let token = jwt.sign({
                user: userFound
            }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });

            resolve({
                code: 200,
                data: {
                    ok: true,
                    user: userFound,
                    token: token
                }
            });
        });
    });
};


module.exports = {
    login
};