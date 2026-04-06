const mongoose = require('mongoose');
require('dotenv').config();

async function test() {
  try {
    console.log('Testing connection to:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('SUCCESS: Connected to local MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('FAILURE:', err.message);
    process.exit(1);
  }
}

test();
