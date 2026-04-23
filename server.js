import express from 'express'
import { expressValidator, result } from expressValidator
//Routes imported from routes folder
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import userRoutes from "./routes/user.routes.js"


const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

// Mount route handlers at their base paths
app.use('/', authRoutes);        // /login, /register, /verify-email, /logout
app.use('/', productRoutes);     // /products, /product/:id, /dashboard, /dashboard/product/*
app.use('/cart', cartRoutes);    // /cart, /cart/add, /cart/update, /cart/remove, /cart/purchase
app.use('/', userRoutes);        // /profile, /profile/edit, /dashboard/profile, /dashboard/profile/edit



app.listen(3000, () => "App is running on 3000")
