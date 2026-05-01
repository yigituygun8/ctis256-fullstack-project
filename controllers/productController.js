import { pool } from "../config/dbpool.js";

// List all products with market information
export const getAllProducts = async (req, res) => {
    try {
        // Show only not expired products
        const sql = `SELECT p.*, m.marketName FROM product p 
                     JOIN Market m ON p.marketID = m.marketID 
                     WHERE p.expirationDate >= CURDATE()`;
        const [rows] = await pool.query(sql);
        res.render('products', { products: rows });
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
        
        res.render('product-details', { product: rows[0] });
    } catch (error) {
        res.status(500).send("Error while getting details" + error);
    }
};

// List the products according to the markets
export const getMarketDashboard = async (req, res) => {
    try {
        const marketID = req.session.userId; // marketID comes from session
        const sql = `SELECT *, (expirationDate < CURDATE()) as isExpired 
                     FROM product WHERE marketID = ?`;
        const [rows] = await pool.query(sql, [marketID]);
        
        // Show only not expired products
        res.render('market/dashboard', { products: rows });
    } catch (error) {
        res.status(500).send("Error while getting products" + error);
    }
};

// Add a new product
export const createProduct = async (req, res) => {
    try {
        const { name, stock, basePrice, discountPrice, expirationDate, image } = req.body;
        const marketID = req.session.userId;

        const sql = `INSERT INTO product (marketID, name, stock, basePrice, discountPrice, expirationDate, image) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await pool.query(sql, [marketID, name, stock, basePrice, discountPrice, expirationDate, image]);
        
        res.redirect('/dashboard'); // After insertion, go back to the dashboard
    } catch (error) {
        res.status(500).send("Product could not added." + error);
    }
};

// Update product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, stock, basePrice, discountPrice, expirationDate, image } = req.body;
        const marketID = req.session.userId;

        const sql = `UPDATE product 
                     SET name = ?, stock = ?, basePrice = ?, discountPrice = ?, expirationDate = ?, image = ? 
                     WHERE itemID = ? AND marketID = ?`;
        await pool.query(sql, [name, stock, basePrice, discountPrice, expirationDate, image, id, marketID]);
        
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send("Product could not updated" + error);
    }
};

// 7. POST /dashboard/product/:id/delete - Ürünü sil (Delete)[cite: 1]
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const marketID = req.session.userId;

        const sql = "DELETE FROM product WHERE itemID = ? AND marketID = ?";
        await pool.query(sql, [id, marketID]);
        
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send("Product could not deleted" + error);
    }
};

// Search Products
export const searchProducts = async (req, res) => {
    try {
        const { keyword, page = 1 } = req.query;
        const consumerID = req.session.userId; // Consumer ID
        
        const pageSize = 3; // 4 products for each page
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
        res.render('search-results', { 
            products: results, 
            currentPage: parseInt(page),
            keyword: keyword 
        });

    } catch (error) {
        res.status(500).send("Error while searching." + error);
    }
};