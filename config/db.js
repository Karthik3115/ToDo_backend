const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('Could not connect to any servers') || error.message.includes('ENOTFOUND') || error.message.includes('queryTxt') || error.message.includes('IP')) {
      console.log('--- TROUBLESHOOTING ---');
      console.log('1. Go to https://cloud.mongodb.com/');
      console.log('2. Network Access -> + Add IP Address');
      console.log('3. Click "Add Current IP Address" or "Allow Access from Anywhere"');
      console.log('4. Click "Confirm" and wait 1 min for it to become ACTIVE');
      console.log('-------------------------');
    }
    // We do NOT process.exit(1) now, let the server stay up so it can return errors.
  }
};

module.exports = connectDB;
