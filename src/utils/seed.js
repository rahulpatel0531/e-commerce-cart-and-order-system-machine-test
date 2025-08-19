require('dotenv').config();
const connectDB = require('../config/db');
const Product = require('../models/Product');

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany([
      { name: 'T-shirt', price: 299, stock: 100, category: 'clothing' },
      { name: 'Jeans', price: 999, stock: 50, category: 'clothing' },
      { name: 'Sneakers', price: 2499, stock: 20, category: 'footwear' }
    ]);
    console.log('Seeded products');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
