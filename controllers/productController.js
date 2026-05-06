import { pool } from "../config/dbpool.js";

// List all products with market information
export const getAllProducts = async (req, res) => {
    try {
        // Show only not expired products
        const sql = `SELECT p.*, m.marketName FROM product p 
                     JOIN Market m ON p.marketID = m.marketID 
                     WHERE p.expirationDate >= CURDATE()`;
        const [rows] = await pool.query(sql);
        res.render('products', { products: rows, user: req.session.user});
    } catch (error) {
        res.status(500).send("Error while getting all products." + error);
    }
};

// Get specific product's details
export const getProductDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `SELECT p.*, m.marketName, m.city, m.district 
                     FROM product p 
                     JOIN Market m ON p.marketID = m.marketID 
                     WHERE p.itemID = ?`;
        const [rows] = await pool.query(sql, [id]);
        
        if (rows.length === 0) return res.status(404).send("Product not found");
        
        res.render('product-details', { product: rows[0], user: req.session.user });
    } catch (error) {
        res.status(500).send("Error while getting product details" + error);
    }
};

// List the products according to the markets
export const getMarketDashboard = async (req, res) => {
    try {
        const marketID = req.session.userId; // marketID comes from session
        const sql = `SELECT * FROM product WHERE marketID = ? ORDER BY expirationDate ASC`;
        const [rows] = await pool.query(sql, [marketID]);
        
        // Show only not expired products
        res.render('dashboard', { products: rows, user: req.session.user });
    } catch (error) {
        res.status(500).send("Error while getting market products" + error);
    }
};

// Add a new product
export const createProduct = async (req, res) => {
    try {
        const { name, stock, basePrice, discountPrice, expirationDate } = req.body;
        const image = req.file ? `/uploads/products/${req.file.filename}` : null; // Store the relative path to the uploaded image
        const marketID = req.session.userId;

        const sql = `INSERT INTO product (marketID, name, stock, basePrice, discountPrice, expirationDate, image) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await pool.query(sql, [marketID, name, stock, basePrice, discountPrice, expirationDate, image]);
        
        res.redirect('/dashboard'); // After insertion, go back to the dashboard
    } catch (error) {
        res.status(500).send("Product could not be added." + error);
    }
};

// Update product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, stock, basePrice, discountPrice, expirationDate } = req.body;
        const marketID = req.session.userId;

        // Get current product to preserve image if not updating it
        const getProductSql = "SELECT image FROM product WHERE itemID = ? AND marketID = ?";
        const [currentProduct] = await pool.query(getProductSql, [id, marketID]);
        
        if (currentProduct.length === 0) {
            return res.status(404).send("Product not found");
        }

        // Use new image if provided, otherwise keep existing image. We cannot write null for fallback
        const image = req.file ? `/uploads/products/${req.file.filename}` : currentProduct[0].image;

        const sql = `UPDATE product 
                     SET name = ?, stock = ?, basePrice = ?, discountPrice = ?, expirationDate = ?, image = ? 
                     WHERE itemID = ? AND marketID = ?`;
        await pool.query(sql, [name, stock, basePrice, discountPrice, expirationDate, image, id, marketID]);
        
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send("Product could not be updated" + error);
    }
};

// Delete product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const marketID = req.session.userId;

        const sql = "DELETE FROM product WHERE itemID = ? AND marketID = ?";
        await pool.query(sql, [id, marketID]);
        
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send("Product could not be deleted" + error);
    }
};

// Search Products
export const searchProducts = async (req, res) => {
    try {
        const { keyword = "", page = 1 } = req.query;
        const consumerID = req.session.userId; // Consumer ID
        
        const pageSize = 4; // 4 products for each page
        const offset = (parseInt(page) - 1) * pageSize;
        const searchKeyword = `%${keyword}%`;

        // City and district informations
        const userSql = "SELECT city, district FROM Consumer WHERE consumerID = ?";
        const [userData] = await pool.query(userSql, [consumerID]);

        if (userData.length === 0) {
            return res.status(404).send("User not found.");
        }

        const { city: userCity, district: userDistrict } = userData[0];

        // Search the products which are in user's city and district
        const productSql = `
            SELECT p.*, m.marketName, m.district as marketDistrict
            FROM product p
            JOIN Market m ON p.marketID = m.marketID
            WHERE p.name LIKE ? 
            AND p.expirationDate >= CURDATE()
            AND m.city = ?
            ORDER BY (m.district = ?) DESC, p.expirationDate ASC
            LIMIT ? OFFSET ?
        `;

        const [results] = await pool.query(productSql, [
            searchKeyword, 
            userCity, 
            userDistrict, 
            pageSize, 
            offset
        ]);

        // Send findings
        res.render('products', { 
            products: results, 
            currentPage: parseInt(page),
            keyword: keyword,
            user: req.session.user
        });

    } catch (error) {
        res.status(500).send("Error while searching." + error);
    }
};