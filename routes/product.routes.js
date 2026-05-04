import express from "express";
const router = express.Router();
import { pool } from "../config/dbpool.js";
import { getAllProducts, getProductDetails, searchProducts, getMarketDashboard } from "../controllers/productController.js";

// Get all products from any market (public)
router.get('/products', getAllProducts);

// Get specific product with id
router.get('/product/:id', getProductDetails);

// Search products with keyword and pagination
router.get('/search', searchProducts);

// Market dashboard - get dashboard of a specific market
router.get('/dashboard', getMarketDashboard);

// Market dashboard - form to add new product
router.get('/dashboard/product/:id/new', (req, res) => {
  // GET /dashboard/product/:id/new - form to add new product
});

// Market dashboard - create new product
router.post('/dashboard/product', (req, res) => {
  // POST /dashboard/product - create new product
});

// Market dashboard - form to edit existing product
router.get('/dashboard/product/:id/edit', (req, res) => {
  // GET /dashboard/product/:id/edit - form to edit existing product
});

// Market dashboard - update existing product
router.post('/dashboard/product/:id/edit', (req, res) => {
  // POST /dashboard/product/:id/edit - update existing product
});

// Market dashboard - delete existing product
router.post('/dashboard/product/:id/delete', (req, res) => {
  // POST /dashboard/product/:id/delete - delete existing product
});

export default router;