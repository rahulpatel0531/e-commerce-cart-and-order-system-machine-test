
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const promoRoutes = require('./routes/promo.routes')
const orderRoutes = require('./routes/order.routes');

const app = express();
const PORT = process.env.PORT || 3000;


// call DB
connectDB(process.env.MONGO_URI)

// security middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// rate limit
const limiter = rateLimit({
    windowMs: (Number(process.env.RATE_LIMIT_WINDOW_MIN) || 15) * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 200
});
app.use(limiter);


// load routes 
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/orders', orderRoutes);

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));


// error handler
app.use(errorHandler);


// start
(async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Server running at port http://localhost:${PORT}`)
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();







