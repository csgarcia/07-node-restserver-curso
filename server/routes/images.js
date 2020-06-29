const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { verifyImagesToken } = require('../middlewares/authentication')

app.get('/image/:type/:img', verifyImagesToken, (req, res) => {

    let type = req.params.type;
    let img = req.params.img;
    let imagePath = path.resolve(__dirname, `../../uploads/${type}/${img}`);
    if (!fs.existsSync(imagePath)) {
        let noImagePath = path.resolve(__dirname, `../assets/no-image.jpg`);
        return res.sendFile(noImagePath);
    }
    return res.sendFile(imagePath);
});

module.exports = app;