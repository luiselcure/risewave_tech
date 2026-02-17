# RiseWave Tech - Setup & Run Instructions

## Prerequisites

- Node.js installed ✅
- MongoDB Atlas configured ✅
- npm packages installed ✅

## Configuration Steps

### 1. Add MongoDB Connection String

Edit `risewave-core/.env.local`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/risewave?retryWrites=true&w=majority
JWT_SECRET=your_secure_random_string_here
```

Replace with your actual MongoDB Atlas connection string that you already have configured.

### 2. Seed the Database

Once the MongoDB connection is configured, seed the database with sample products:

**Option A: Using browser**

1. Start dev server (see step 3)
2. Visit: `http://localhost:3000/api/seed`

**Option B: Using curl**

```bash
curl -X POST http://localhost:3000/api/seed
```

This will create 12 sample products (4 per category).

### 3. Run Development Server

```bash
cd C:\Users\luise\Documents\dev\risewave_tech\risewave-core
npm run dev
```

Visit: `http://localhost:3000`

## Testing the Application

### Test Flow 1: User Registration & Login

1. Go to http://localhost:3000
2. Click "Registrarse"
3. Fill in all required fields (nombre, apellido, email, teléfono, password, address)
4. Submit - you'll be auto-logged in and redirected to dashboard
5. Verify your info is displayed correctly

### Test Flow 2: Shopping

1. Click "Catálogo" in navbar
2. Try category filters (Office, Gaming, Home, All)
3. Click "Añadir al Carrito" on several products
4. Check cart icon counter updates
5. Click cart icon to view cart
6. Test quantity controls (+/-)
7. Try "Proceder al Pago" (will show MercadoPago stub alert)

### Test Flow 3: Chatbot

1. Click the floating bot icon (bottom-right)
2. Try asking about "envíos", "materiales", "tiempos", or "personalizado"
3. Verify personalized greeting if logged in

## Next Steps

### MercadoPago Integration

When ready to process payments:

1. Sign up at [mercadopago.com](https://mercadopago.com)
2. Get Public Key and Access Token
3. Follow instructions in `app/cart/page.js` line 14-30

## Project Structure

```
risewave-core/
├── app/              # Pages & API routes
├── components/       # React components
├── lib/              # Utilities (DB, Store)
├── models/           # Mongoose schemas
└── .env.local        # Environment variables (CONFIGURE THIS!)
```

## Important Files

- **Database Config**: `lib/db.js`
- **User Model**: `models/User.js`
- **Product Model**: `models/Product.js`
- **Global Store**: `lib/store.js`
- **Tailwind Theme**: `app/globals.css`

## Troubleshooting

### MongoDB Connection Error

- Verify connection string in `.env.local`
- Check network access in MongoDB Atlas (whitelist your IP)
- Ensure database user has read/write permissions

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000
# Then run dev server again
npm run dev
```

### Missing Dependencies

```bash
npm install
```
