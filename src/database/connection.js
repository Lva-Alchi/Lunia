const mongoose = require('mongoose');

const engine = process.env.DB_ENGINE.toLowerCase();

async function connectDB() {
    try {
        if (engine === 'local') {
            console.log('📦 [DATABASE] Running on Local Machine !');
        } else if (engine === 'mongodb') {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('📦 [DATABASE] Connected to mongoDB cloud !');
        } else {
            console.error('❌ [ERR_DB] Error: DB_ENGINE must be "mongodb" or "local"');
            process.exit(1);
        }
    } catch (error) {
        console.error(`❌ [DATABASE]  Connection to ${engine} failed:`, error.message);
        process.exit(1);
    }
}

module.exports = { connectDB };