// ===================== //
// Port //
// ===================== //
process.env.PORT = process.env.PORT || 3000;

// ===================== //
// Enviroment //
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// ===================== //

// ===================== //
// Enviroment //
let urlDb = 'mongodb://localhost:27017/cafe';
if (process.env.NODE_ENV !== 'dev') {
    urlDb = 'mongodb://carlos:123456-a@ds259109.mlab.com:59109/cafe'
}
process.env.URL_DB = urlDb;
// ===================== //