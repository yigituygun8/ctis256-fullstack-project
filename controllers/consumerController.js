import { pool } from "../config/dbpool.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

function isBcryptHash(password) {
        return typeof password === "string" && password.startsWith("$2");
}

// Update consumer profile
export const updateConsumerProfile = async (req, res) => {
    const errors = validationResult(req);
    const user_type = 'consumer';
    const currentUser = req.session.user;
    const profilePath = '/profile';

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

        const { email, city, district, fullName, currentPassword, newPassword } = req.body;
        const consumerID = currentUser.consumerID;

        // Password check
        const isMatch = isBcryptHash(currentUser.password)
                    ? await bcrypt.compare(currentPassword, currentUser.password)
                    : currentPassword === currentUser.password;
        if (!isMatch) {
            req.session.status = { isSuccess: false, msg: "Password is incorrect" };
            return res.redirect(profilePath);
        }

        // Has a new password been entered? If empty the old password will remain
        let finalPassword = currentUser.password;
        if (newPassword && newPassword.trim() !== "") {
            finalPassword = await bcrypt.hash(newPassword, 10);
        }

        // Email check
        if (email !== currentUser.email) {
            const [rows] = await pool.query(`SELECT * FROM Consumer WHERE email = ? AND consumerID != ?`, [email, consumerID]);
            if (rows.length !== 0) {
                req.session.status = { isSuccess: false, msg: "This email address is already in use." };
                return res.redirect(profilePath);
            }
        }

        // Update database
        await pool.query(
            `UPDATE Consumer SET email = ?, customerName = ?, city = ?, district = ?, password = ? WHERE consumerID = ?`,
            [email, fullName, city, district, finalPassword, consumerID]
        );

        // Update session
        const [updatedRows] = await pool.query(`SELECT * FROM Consumer WHERE consumerID = ?`, [consumerID]);
        req.session.user = { ...updatedRows[0], type: currentUser.type || user_type };
        req.session.user_type = currentUser.type || user_type;
        req.session.userId = consumerID;
        req.session.status = { isSuccess: true, msg: "Customer profile has updated successfully!" };

        res.redirect(profilePath);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error while updating the profile.");
    }
};

// Get consumer profile
export const getConsumerProfile = async (req, res) => {
    try {
        const currentUser = req.session.user;
        if (!currentUser) {
            return res.redirect('/login');
        }

        const consumerID = currentUser.consumerID;
        const [rows] = await pool.query(
            "SELECT email, customerName, city, district FROM Consumer WHERE consumerID = ?", 
            [consumerID]
        );
        
        if(currentUser.type === 'market') {
            return res.redirect('/dashboard/profile'); // If a market somehow tries to access consumer profile, redirect to market profile
        }

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
            user_type: 'consumer',
            errors: {}
        });

    } catch (error) {
        console.error("Error while loading profile informations.", error);
        res.status(500).send("Error while loading profile informations.");
    }
};
