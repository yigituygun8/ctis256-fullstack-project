import { pool } from "../config/dbpool.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

// Update consumer profile
export const updateConsumerProfile = async (req, res) => {
    const errors = validationResult(req);
    const user_type = 'consumer';
    const activeUser = req.session.activeUser;

    if (!errors.isEmpty()) {
        return res.render('profile', { form: req.body, errors: errors.mapped(), user_type, status: null });
    }

    try {
        const { email, city, district, fullName, currentPassword, newPassword } = req.body;
        const consumerID = activeUser.consumerID;

        // Password check
        const isMatch = await bcrypt.compare(currentPassword, activeUser.password);
        if (!isMatch) {
            req.session.status = { isSuccess: false, msg: "Password is incorrect" };
            return res.redirect('/profile');
        }

        // Has a new password been entered? If empty the old password will remain
        let finalPassword = activeUser.password;
        if (newPassword && newPassword.trim() !== "") {
            finalPassword = await bcrypt.hash(newPassword, 10);
        }

        // Email check
        if (email !== activeUser.email) {
            const [rows] = await pool.query(`SELECT * FROM Consumer WHERE email = ? AND consumerID != ?`, [email, consumerID]);
            if (rows.length !== 0) {
                req.session.status = { isSuccess: false, msg: "This email address is already in use." };
                return res.redirect('/profile');
            }
        }

        // Update database
        await pool.query(
            `UPDATE Consumer SET email = ?, customerName = ?, city = ?, district = ?, password = ? WHERE consumerID = ?`,
            [email, fullName, city, district, finalPassword, consumerID]
        );

        // Update session
        const [updatedRows] = await pool.query(`SELECT * FROM Consumer WHERE consumerID = ?`, [consumerID]);
        req.session.activeUser = updatedRows[0];
        req.session.status = { isSuccess: true, msg: "Customer profile has updated successfully!" };

        res.redirect("/profile");

    } catch (error) {
        console.error(error);
        res.status(500).send("Error while updating the profile.");
    }
};

// Get consumer profile
export const getConsumerProfile = async (req, res) => {
    try {
        const consumerID = req.session.activeUser.consumerID;
        const [rows] = await pool.query(
            "SELECT email, customerName, city, district FROM Consumer WHERE consumerID = ?", 
            [consumerID]
        );

        if (rows.length === 0) {
            return res.status(404).send("User could not found.");
        }

        const user = rows[0];

        const status = req.session.status || null;
        
        // Status will only shown once so here, we should delete it.
        delete req.session.status;

        res.render('profile', { 
            user,             
            status,         
            user_type: 'consumer'
        });

    } catch (error) {
        console.error("Error while loading profile informations.", error);
        res.status(500).send("Error while loading profile informations.");
    }
};