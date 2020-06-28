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
process.env.TOKEN_EXPIRATION_TIME = '48h';

// ===================== //
// Seed token //
// ===================== //
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'this-is-seed-dev'; //30 days

// ===================== //
// Google cliend id //
// ===================== //
process.env.CLIENT_ID = process.env.CLIENT_ID || '888753828179-i87gl7ioegg27atn5jkg4ttl16igbfrs.apps.googleusercontent.com'