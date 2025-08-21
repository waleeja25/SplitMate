// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// dotenv.config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("MongoDB Connected");
//   } catch (error) {
//     console.error("MongoDB Connection Error:", error.message);
//     process.exit(1); 
//   }
// };

// module.exports = connectDB;
// db.js
const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
cached.promise = mongoose.connect(process.env.MONGODB_URI)
  .then((mongoose) => {
    console.log("MongoDB Connected");
    return mongoose;
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    throw err;
  });

  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
