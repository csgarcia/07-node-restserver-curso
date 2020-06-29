const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');
const fs = require('fs');
const path = require('path');

//default options
app.use(fileUpload());

app.put('/upload/:type/:id', (req, res) => {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: `No se han seleccionado archivos para subir`
                }
            });
    }

    //Validate types
    let validTypes = ['products', 'users'];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: `tipos permitidos de archivos para subir son: ${validTypes.join(', ')}`,
                    given_type: type
                }
            });
    }

    // for this example custom_file_name is the name that we send the input, e.g. param name from postman is custom_file_name
    let sampleFile = req.files.custom_file_name;

    //Validations
    //Extensions:
    let validExtensions = ['png', 'jpg', 'jpeg'];
    let fileName = sampleFile.name.split('.');
    let fileExtension = fileName[1];

    if (validExtensions.indexOf(fileExtension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: `Archivo no tiene extensión valida, las permitidas son: ${validExtensions.join(', ')}`,
                    given_extension: fileExtension
                }
            });
    }

    // Changing file name
    let fileNameToSave = `${id}-${new Date().getMilliseconds()}.${fileExtension}`;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`uploads/${type}/${fileNameToSave}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //File was saved on file system
        switch (type) {
            case 'users':
                imageUser(id, fileNameToSave, res);
                break;
            case 'products':
                imageProduct(id, fileNameToSave, res);
                break;
            default:
                console.log('type not foudn to save image');
        }

    });

});

let imageUser = (id, fileName, res) => {
    User.findById(id, (err, userDb) => {
        if (err) {
            deleteFile(fileName, 'users');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!userDb) {
            deleteFile(fileName, 'users');
            return res.status(400).json({
                ok: false,
                err: {
                    message: `User not found for this id: ${id}`
                }
            })
        }

        //check if file exists before delete it
        deleteFile(userDb.img, 'users');

        userDb.img = fileName;
        userDb.save((err, userSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                user: userSaved,
                img: fileName
            });
        });

    });
};

let imageProduct = (id, fileName, res) => {

    Product.findById(id, (err, productDb) => {
        if (err) {
            deleteFile(fileName, 'products');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDb) {
            deleteFile(fileName, 'products');
            return res.status(400).json({
                ok: false,
                err: {
                    message: `User not found for this id: ${id}`
                }
            });
        }

        //check if file exists before delete it
        deleteFile(productDb.img, 'products');

        productDb.img = fileName;
        productDb.save((err, productSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                products: productSaved,
                img: fileName
            });
        });

    });
};

let deleteFile = (fileName, type) => {
    let pathUrl = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);
    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }
};


module.exports = app;