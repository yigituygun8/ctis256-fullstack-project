import { validationResult } from "express-validator";
import { pool } from "../config/dbpool.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer"

function isBcryptHash(password) {
        return typeof password === "string" && password.startsWith("$2");
}

async function sendVerificationCode(userEmail, code) {
        const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                },
        });

        return transporter.sendMail({
                from: `"Uygun Markets" <${process.env.EMAIL_USER}>`,
                to: userEmail,
                subject: "Your Verification Code",
                text: `Your 6-digit code is: ${code}`,
                html: `<b>Your 6-digit code is: ${code}</b>`,
        });
}

// Register
export const registerEmail = async (req, res) => {
    const errors = validationResult(req);
    const user_type = req.body.user_type || req.query.type || 'consumer';

    if(!errors.isEmpty()){
        return res.render('register', { form: req.body, errors : errors.mapped(), user_type, error: {}});
    } else {

        try {
            const table = user_type === "consumer" ? "Consumer" : "Market";
            const [rows] = await pool.query(`select * from ${table} where email = ?`, [req.body.email]);
            if(rows.length !== 0){
                const error = { field: "email", msg: "*This email already exists"};
                return res.render('register', { form : req.body, errors: {}, user_type, error});
            }
        } catch (error) {
            return res.status(500).send("Error while registering the user." + error);
        }

        const { email, password, city, district, fullName, marketName } = req.body;
        const name = (user_type === "consumer") ? fullName : marketName;

        const hashed_password = await bcrypt.hash(password, 10);
        const user_to_verify = {
            email,
            password: hashed_password,
            city,
            district,
            name,
            user_type
        };

        req.session.user_to_verify = user_to_verify;

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        req.session.code = verificationCode;
        try {
            await sendVerificationCode(email, verificationCode);
        } catch (error) {
            delete req.session.user_to_verify;
            delete req.session.code;
            return res.status(500).send("Error while sending verification email. " + error.message);
        }

        res.redirect("/verify-email");
    }
};

// Verify Email after registration and then create the user in the database
export const verifyEmail = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.render("verify", { form : req.body, errors: errors.mapped() })
    }
    if (!req.session.user_to_verify) {
        return res.redirect("/register");
    }

    try {
        const insertUser = req.session.user_to_verify;
        const isConsumer = insertUser.user_type === "consumer";
        const table = isConsumer ? "Consumer" : "Market";
        const nameColumn = isConsumer ? "customerName" : "marketName";

        await pool.query(
            `insert into ${table} (email, ${nameColumn}, password, city, district) values ( ?, ?, ?, ?, ? )`,
            [insertUser.email, insertUser.name, insertUser.password, insertUser.city, insertUser.district]
        );

        delete req.session.user_to_verify;
        delete req.session.code;
        res.redirect("/login");

    } catch (error) {
        res.status(500).send("Error while adding the user." + error);
    }

};

// Login
export const loginUser = async (req, res) => {
      const user_type = req.body.user_type || req.query.type || 'consumer';
    
      const errors = validationResult(req);
    
      if(!errors.isEmpty()){
        return res.render('login', { form: req.body, errors : errors.mapped(), user_type, loginError: {}});
      } else{
        const email = req.body.email;
        const password = req.body.password;

        const table = user_type === "consumer" ? "Consumer" : "Market";

        try {
            const [rows] = await pool.query(`select * from ${table} where email = ?`, [email]);
            const [user] = rows;

            if(!user){
                const loginError = { field: "email", msg: "*No user with this email" }
                return res.render('login', { form: req.body, errors : errors.mapped(), user_type, loginError});
            }
            
            const passwordMatches = isBcryptHash(user.password)
                ? await bcrypt.compare(password, user.password)
                : password === user.password;

            if(!passwordMatches){
                const loginError = { field: "password", msg: "*Wrong password" }
                return res.render('login', { form: req.body, errors : errors.mapped(), user_type, loginError});
            }

            const sessionUser = { ...user, type: user_type };
            req.session.user = sessionUser;
            req.session.user_type = user_type;
            req.session.userId = sessionUser.consumerID || sessionUser.marketID;
    
            return res.redirect("/");

        } catch (error) {
            return res.status(500).send("Error while getting the user." + error);
        }
        

      }
};