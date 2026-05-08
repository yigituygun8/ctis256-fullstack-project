import { pool } from "../config/dbpool.js";

// Get cart data
export const getCartData = async (req, res) => {
    try {
        const consumerID = req.session.user?.consumerID || null;

        if (!consumerID) {
            return res.status(401).json({ error: "Please log in to view the cart." });
        }

        const sql = `
            SELECT c.*, p.name, p.discountPrice, p.image, p.stock, (c.quantity * p.discountPrice) as itemTotal
            FROM ShoppingCart c
            JOIN product p ON c.itemID = p.itemID
            WHERE c.consumerID = ?`;
        
        const [items] = await pool.query(sql, [consumerID]);

        // Calculating total
        let grandTotal = 0;

        for (const item of items) {
            grandTotal += item.itemTotal;
        }

        res.status(200).json({ items, grandTotal });
    } catch (error) {
        res.status(500).json({ error: "Could not reach cart data." });
    }
};

// Add to cart
export const addToCart = async (req, res) => {
    try {
        const { itemID, marketID, quantity } = req.body;
        const consumerID = req.session.user?.consumerID || null;

        if (!consumerID) {
            return res.status(401).json({ success: false, error: "Please log in to add items to the cart." });
        }

        const [productRows] = await pool.query("SELECT stock FROM product WHERE itemID = ?", [itemID]);
        if (productRows.length === 0) {
            return res.status(400).json({ success: false, error: "Product not found." });
        }
        const stock = productRows[0].stock;
        const q = parseInt(quantity) || 1;

        if (q <= 0) {
            return res.status(400).json({ success: false, error: "Quantity must be at least 1." });
        }

        if (stock <= 0) {
            return res.status(400).json({ success: false, error: "This product is out of stock." });
        }
        if (q > stock) {
            return res.status(400).json({ success: false, error: `Only ${stock} items are available in stock.` });
        }

        // Check current cart quantity for this item
        const [cartRows] = await pool.query("SELECT quantity FROM ShoppingCart WHERE itemID = ? AND consumerID = ?", [itemID, consumerID]);
        const currentQty = cartRows.length > 0 ? cartRows[0].quantity : 0;
        const totalQty = currentQty + q;

        if (totalQty > stock) {
            return res.status(400).json({ success: false, error: `Only ${stock - currentQty} more items available. You already have ${currentQty} in cart.` });
        }

        const sql = `
            INSERT INTO ShoppingCart (itemID, marketID, consumerID, quantity) 
            VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE quantity = quantity + ?`;
        
        await pool.query(sql, [itemID, marketID, consumerID, q, q]);
        
        
        res.status(200).json({ success: true, message: "Product has added to the cart." });
    } catch (error) {
        res.status(500).json({ success: false, error: "Product could not be added to the cart." });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const { itemID, quantity } = req.body;
        const consumerID = req.session.user?.consumerID || null;

        if (!consumerID) {
            return res.status(401).json({ success: false, error: "Please log in to update the cart." });
        }

        // Validate against current stock
        const [rows] = await pool.query("SELECT stock FROM product WHERE itemID = ?", [itemID]);
        if (!rows || rows.length === 0) {
            return res.status(400).json({ success: false, error: "Product not found." });
        }
        const stock = rows[0].stock;
        const q = parseInt(quantity) || 1;

        if (stock <= 0) {
            // Remove from cart if out of stock
            await pool.query("DELETE FROM ShoppingCart WHERE itemID = ? AND consumerID = ?", [itemID, consumerID]);
            return res.status(200).json({ success: false, error: "This product is no longer available (out of stock).", removed: true });
        }

        const newQty = Math.max(1, Math.min(q, stock));
        const sql = "UPDATE ShoppingCart SET quantity = ? WHERE itemID = ? AND consumerID = ?";
        await pool.query(sql, [newQty, itemID, consumerID]);

        res.status(200).json({ success: true, message: "Quantity updated.", quantity: newQty });
    } catch (error) {
        res.status(500).json({ success: false, error: "Could not update quantity." });
    }
};

// Delete from the cart
export const removeFromCart = async (req, res) => {
    try {
        const { itemID } = req.body;
        const consumerID = req.session.user?.consumerID || null;

        if (!consumerID) {
            return res.status(401).json({ success: false, error: "Please log in to update the cart." });
        }

        const sql = "DELETE FROM ShoppingCart WHERE itemID = ? AND consumerID = ?";
        await pool.query(sql, [itemID, consumerID]);
        
        res.status(200).json({ success: true, message: "Product has deleted." });
    } catch (error) {
        res.status(500).json({ success: false, error: "Product could not be deleted." });
    }
};

// Complete purchase
export const completePurchase = async (req, res) => {
    try {
        const consumerID = req.session.user?.consumerID || null;

        if (!consumerID) {
            return res.status(401).json({ success: false, error: "Please log in to complete the purchase." });
        }

        // Drop the quantity
        const updateStockSql = `
            UPDATE product p
            JOIN ShoppingCart c ON p.itemID = c.itemID
            SET p.stock = p.stock - c.quantity
            WHERE c.consumerID = ?`;
        await pool.query(updateStockSql, [consumerID]);

        // Clear shopping cart
        const clearCartSql = "DELETE FROM ShoppingCart WHERE consumerID = ?";
        await pool.query(clearCartSql, [consumerID]);

        res.status(200).json({ success: true, message: "The purchase was successfully completed!" });

    } catch (error) {
        console.error("Error while purchasing", error);
        res.status(500).json({ success: false, error: "The operation could not be completed." });
    }
};