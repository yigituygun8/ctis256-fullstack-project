import { pool } from "../config/dbpool.js";

// Get cart data
export const getCartData = async (req, res) => {
    try {
        const consumerID = req.session.user.consumerID || null; 

        if (!consumerID) {
            return res.status(401).json({ error: "Please log in to view the cart." });
        }

        const sql = `
            SELECT c.*, p.name, p.discountPrice, p.image, (c.quantity * p.discountPrice) as itemTotal
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
        const consumerID = req.session.user.consumerID || null;

        if (!consumerID) {
            return res.status(401).json({ success: false, error: "Please log in to add items to the cart." });
        }

        const sql = `
            INSERT INTO ShoppingCart (itemID, marketID, consumerID, quantity) 
            VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE quantity = quantity + ?`;
        
        await pool.query(sql, [itemID, marketID, consumerID, quantity, quantity]);
        
        
        res.status(200).json({ success: true, message: "Product has added to the cart." });
    } catch (error) {
        res.status(500).json({ success: false, error: "Product could not be added to the cart." });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const { itemID, quantity } = req.body;
        const consumerID = req.session.user.consumerID || null;

        if (!consumerID) {
            return res.status(401).json({ success: false, error: "Please log in to update the cart." });
        }

        const sql = "UPDATE ShoppingCart SET quantity = ? WHERE itemID = ? AND consumerID = ?";
        await pool.query(sql, [quantity, itemID, consumerID]);

        res.status(200).json({ success: true, message: "Quantity updated." });
    } catch (error) {
        res.status(500).json({ success: false, error: "Could not update quantity." });
    }
};

// Delete from the cart
export const removeFromCart = async (req, res) => {
    try {
        const { itemID } = req.body;
        const consumerID = req.session.user.consumerID || null;

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
        const consumerID = req.session.user.consumerID || null;

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