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
    urlDb = process.env.MONGO_URI
}
process.env.URL_DB = urlDb;
// ===================== //