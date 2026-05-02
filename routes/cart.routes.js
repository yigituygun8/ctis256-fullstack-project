import express from "express";
import { addToCart, getCartData, removeFromCart, updateQuantity, completePurchase } from "../controllers/cartController.js";
const router = express.Router();

// View shopping cart
router.get('/', (req, res) => {
  // P.S. Initially, we decided that we could use a cart page but then we changed our mind and decided to use a cart sidebar instead. So, this endpoint is not used in the project but we left it here just in case we want to use it in the future.
  res.redirect("/products");
});

// Load cart data as JSON (for AJAX)
router.get('/data', getCartData); 

// Add product to cart. Returns success status and message as JSON.
router.post('/add', addToCart);

// Update product quantity in cart. Returns success status and message as JSON.
router.post('/update', updateQuantity);

// Remove product from cart. Returns success status and message as JSON.
router.post('/remove', removeFromCart);

// Complete purchase. Returns success status and message as JSON.
router.post('/purchase', completePurchase);

export default router;