# Ecom Machine Test

## Setup
1. copy .env.sample -> .env and set MONGO_URI and JWT_SECRET
2. npm install
3. npm run seed  # seed products
4. npm run dev

## Endpoints
- /api/auth/register, /api/auth/login
- /api/products (GET public) + POST/PATCH/DELETE (require auth)
- /api/cart (add/get/update/clear)
- /api/promos (GET /:code public, create/update/delete require auth)
- /api/orders/checkout (requires auth)

## Notes
- Checkout uses MongoDB transactions. For local testing, enable replica set or fallback logic is provided (atomic findOneAndUpdate).
- Use Postman collection attached (create requests above).
