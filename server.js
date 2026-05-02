import express from 'express'
import { body, validationResult } from "express-validator"
import session from 'express-session'
import "dotenv/config"
//Routes imported from routes folder
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import userRoutes from "./routes/user.routes.js"


const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored / modified
}))

// Home endpoint
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user || null });
});

// Mount route handlers at their base paths
app.use('/', authRoutes);        // /login, /register, /verify-email, /logout
app.use('/', productRoutes);     // /products, /product/:id, /dashboard, /dashboard/product/*
app.use('/cart', cartRoutes);    // /cart, /cart/add, /cart/update, /cart/remove, /cart/purchase
app.use('/', userRoutes);        // /profile, /profile/edit, /dashboard/profile, /dashboard/profile/edit
app.use((req, res) => {
  res.redirect('/'); // Redirect any unknown routes to home page
});

app.listen(3000, () => console.log("App is running on http://localhost:3000"))
