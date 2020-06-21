// ===================== //
// Port //
// ===================== //
process.env.PORT = process.env.PORT || 3000;

// ===================== //
// Enviroment //
// ===================== //
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===================== //
// Db //
// ===================== //
let urlDb = 'mongodb://localhost:27017/cafe';
if (process.env.NODE_ENV !== 'dev') {
    urlDb = process.env.MONGO_URI
}
process.env.URL_DB = urlDb;

// ===================== //
// Token expiration time //
// ===================== //
process.env.TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 30; //30 days

// ===================== //
// Seed token //
// ===================== //
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'this-is-seed-dev'; //30 days