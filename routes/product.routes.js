import express from "express";
const router = express.Router();

// Get all products
router.get('/products', (req, res) => {
  // GET /products - list of all products
});

// Get specific product
router.get('/product/:id', (req, res) => {
  // GET /product/:id - details of a specific product
});

// Market dashboard - get dashboard
router.get('/dashboard', (req, res) => {
  // GET /dashboard - market overview and products list
});

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