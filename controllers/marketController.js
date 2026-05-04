import { pool } from "../config/dbpool.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { isBcryptHash } from "../utils/password.js";

// Update market profile
export const updateMarketProfile = async (req, res) => {
    const errors = validationResult(req);
    const user_type = 'market';
    const currentUser = req.session.user;
    const profilePath = '/dashboard/profile';

    // Validation check
    if (!errors.isEmpty()) {
        return res.render('profile', { 
            user: req.body,
            errors: errors.mapped(), 
            user_type, 
            status: null 
        });
    }

    try {
        if (!currentUser) {
            return res.redirect('/login'); // If user is not logged in, redirect to login page
        }

        const { email, city, district, marketName, currentPassword, newPassword } = req.body;
        const marketID = currentUser.marketID;

        // Password check
        const isMatch = isBcryptHash(currentUser.password)
                    ? await bcrypt.compare(currentPassword, currentUser.password)
                    : currentPassword === currentUser.password;

        
        if (!isMatch) {
            req.session.status = { 
                isSuccess: false, 
                msg: "Password is incorrect." 
            };
            return res.redirect(profilePath);
        }

        // Password
        let finalPassword = currentUser.password;
        if (newPassword && newPassword.trim() !== "") { // If user wants to change the password
            finalPassword = await bcrypt.hash(newPassword, 10);
        }

        // Email check
        if (email !== currentUser.email) {
            const [rows] = await pool.query(
                `SELECT * FROM Market WHERE email = ? AND marketID != ?`, 
                [email, marketID]
            );
            if (rows.length !== 0) {
                req.session.status = { 
                    isSuccess: false, 
                    msg: "Email already exists." 
                };
                return res.redirect(profilePath);
            }
        }

        // Update database
        const updateSql = `
            UPDATE Market 
            SET email = ?, marketName = ?, city = ?, district = ?, password = ? 
            WHERE marketID = ?`;
        
        await pool.query(updateSql, [email, marketName, city, district, finalPassword, marketID]);

        // Update session
        const [updatedRows] = await pool.query(`SELECT * FROM Market WHERE marketID = ?`, [marketID]);
        req.session.user = { ...updatedRows[0], type: currentUser.type || user_type };
        req.session.user_type = currentUser.type || user_type;
        req.session.userId = marketID;
        
        req.session.status = { 
            isSuccess: true, 
            msg: "Market profile has updated successfully!" 
        };

        res.redirect(profilePath);

    } catch (error) {
        console.error("Market Update Error:", error);
        res.status(500).send("Market güncellenirken bir hata oluştu: " + error.message);
    }
};

// Get market profile
export const getMarketProfile = async (req, res) => {
    try {
        const currentUser = req.session.user;
        if (!currentUser) {
            return res.redirect('/login');
        }

        const marketID = currentUser.marketID;

        const [rows] = await pool.query(
            "SELECT email, marketName, city, district FROM Market WHERE marketID = ?", 
            [marketID]
        );

        if(currentUser.type === 'consumer') {
            return res.redirect('/profile'); // If a consumer somehow tries to access market profile, redirect to consumer profile
        }

        if (rows.length === 0) {
            return res.status(404).send("Market could not found.");
        }

        const user = rows[0];

        const status = req.session.status || null;
        
        // Status will only shown once so here, we should delete it.
        delete req.session.status;

        res.render('profile', { 
            user,              
            status,     
            user_type: 'market',
            errors: {}
        });

    } catch (error) {
        console.error("Error while loading market informations", error);
        res.status(500).send("Error while loading market informations");
    }
};
