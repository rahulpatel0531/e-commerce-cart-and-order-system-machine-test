const mongoose = require('mongoose');

const connectDB = async (mongoUri) => {
  if (!mongoUri) throw new Error('MONGO_URI required');
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('MongoDB connected');
};

// const connectDB = async(mongouri) => {
//     try {
//         if(!mongouri)  throw new Error('MONGO URI required');
//         const conn = await mongoose.connect(mongouri /* { useNewUrlParser: true, useUnifiedTopology: true} */ );
//           console.log('MongoDB connected', conn.connection.name);
//     } catch (error) {
//           console.log('MongoDB connection failed: ', error);
//           process.exit(1);
//     }
// };

module.exports = connectDB;