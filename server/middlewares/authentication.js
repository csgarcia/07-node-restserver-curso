const jwt = require('jsonwebtoken');

// ===================== //
// Verify token //
// ===================== //
let verifyToken = (req, res, next) => {
    let token = req.get('Authorization') || null;
    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token not found on request'
                }
            });
        }
        req.user = decoded.user;
        next();
    });
};

// ===================== //
// Verify AdminRole
// ===================== //
let verifyAdminRole = (req, res, next) => {
    let user = req.user;
    let role = user.role || null;
    if (!role || role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Permission denied for user to do this operation'
            }
        });
    }
    next();
};

// ===================== //
// Verify token for images
// ===================== //
let verifyImagesToken = (req, res, next) => {
    let token = req.query.token || null;
    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token not found on request or not valid'
                }
            });
        }
        req.user = decoded.user;
        next();
    });
};


module.exports = {
    verifyToken,
    verifyAdminRole,
    verifyImagesToken
};