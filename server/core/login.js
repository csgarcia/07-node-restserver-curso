const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

// google config
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


let google = async(token) => {
    return new Promise((resolve, reject) => {
        verify(token).then(googleUser => {
            User.findOne({ email: googleUser.email }, (err, userDb) => {
                if (err) {
                    resolve({
                        code: 500,
                        data: { ok: false, err }
                    });
                }
                if (userDb) {
                    if (userDb.google === false) {
                        console.log('user found does not have google profile');
                        resolve({
                            code: 500,
                            data: {
                                ok: false,
                                err: {
                                    message: 'Should use regular login'
                                }
                            }
                        });
                    } else {
                        console.log('resolve new token');
                        let token = jwt.sign({
                            user: userDb
                        }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });

                        resolve({
                            code: 200,
                            data: {
                                ok: true,
                                user: userDb,
                                token
                            }
                        });
                    }
                } else {
                    //if user does not exists on db, create new user
                    let user = new User();
                    user.name = googleUser.name;
                    user.email = googleUser.email;
                    user.img = googleUser.img;
                    user.google = true;
                    user.password = 'not_required_for_google_users';

                    user.save((err, userSaved) => {
                        console.log(userSaved);
                        if (err) {
                            resolve({
                                code: 500,
                                data: { ok: false, err }
                            });
                        }

                        let token = jwt.sign({
                            user: userSaved
                        }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });

                        resolve({
                            code: 200,
                            data: {
                                ok: true,
                                user: userSaved,
                                token
                            }
                        });
                    });
                } //else
            });
        }).catch(err => {
            resolve({
                code: 500,
                data: {
                    ok: false
                }
            }); //Resolve
        }); //Catch
    }); //Promise
};


module.exports = {
    login,
    google
};