const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`[DB] Connected ✅!`);
  } catch (error) {
    console.log(`[DB] Failed To Connect DB\n`, error);
  }
};
