const dotenv = require('dotenv');

dotenv.config();

const localMongoURI = 'mongodb://127.0.0.1:27017/shoppinglist';

function buildMongoUri(uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.ATLAS_MONGODB_URI || localMongoURI) {
    if (!uri) {
        return '';
    }

    return uri.trim();
}

module.exports = {
    mongoURI: buildMongoUri(),
    buildMongoUri,
    localMongoURI
};