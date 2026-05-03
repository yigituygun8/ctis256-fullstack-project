import { body, validationResult } from "express-validator";
import { pool } from "../config/dbpool.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer"

async function sendVerificationCode(userEmail, code) {
  // 1. Create a transporter object
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define the email content
  let info = await transporter.sendMail({
    from: '"Uygun Markets" <' + process.env.EMAIL_USER + '>' , // sender address
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
        //Sended errors with .mapped() for easier checking
        res.render('register', { form: req.body, errors : errors.mapped(), user_type, error: {}});
    } else {

        try {
            const table = user_type === "consumer" ? "Consumer" : "Market";
            const [rows] = await pool.query(`select * from ${table} where email = ?`, [req.body.email]);
            if(rows.length !== 0){
                const error = { field: "email", msg: "*This email already exists"};
                return res.render('register', { form : req.body, errors: {}, user_type, error});
            }
        } catch (error) {
            res.status(500).send("Error while registering the user." + error);
        }

        //TO-DO: Verification
        //extract the inputs from the form according to user type
        const { email, password, city, district, fullName, marketName } = req.body;
        const name = (user_type === "consumer") ? fullName : marketName;

        //create the user to be verified
        const hashed_password = await bcrypt.hash(password,10)
        //These are the attributes of a user use these while inserting into the database (req.session.user_to_verify.city)
        const user_to_verify = {
            email,
            password: hashed_password,
            city,
            district,
            name,
            user_type
        };

        //console.log(user_to_verify);
        req.session.user_to_verify = user_to_verify;

        //Verifiocation part
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const userEmail = req.body.email;
        // console.log(verificationCode);
        // console.log(userEmail);
        req.session.code = verificationCode;
        sendVerificationCode(userEmail, verificationCode);


        res.redirect("/verify-email");
    }
};

// Verify Email
export const verifyEmail = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        res.render("verify", { form : req.body, errors: errors.mapped() })
    }
    else{
    
        //Queries for adding the user to the db using the user_to_verify from session. Fields are -> email, password, city, district, name, user_type
        try {
            const table = req.session.user_to_verify.user_type === "consumer" ? "Consumer" : "Market";
            const insertUser = req.session.user_to_verify;

            const [result] = await pool.query(`insert into ${table} (email, customerName, password, city, district) values ( ?, ?, ?, ?, ? )`,
                [insertUser.email, insertUser.name, insertUser.password, insertUser.city, insertUser.district]
            )

            delete req.session.user_to_verify;
            res.redirect("/login")

        } catch (error) {
            res.status(500).send("Error while adding the user." + error);
        }
    }

};

// Login
export const loginUser = async (req, res) => {
      const user_type = req.body.user_type || req.query.type || 'consumer';
    
      const errors = validationResult(req);
    
      if(!errors.isEmpty()){
        //Sended errors with .mapped() for easier checking
        res.render('login', { form: req.body, errors : errors.mapped(), user_type, loginError: {}});
      } else{
        //TO-DO: Email and Password check with db
        const email = req.body.email;
        const password = req.body.password
        // console.log(email);
        // console.log(hashed_password);

        const table = user_type === "consumer" ? "Consumer" : "Market";

        try {
            const [rows] = await pool.query(`select * from ${table} where email = ?`, [email]);
            const [user] = rows;

            if(!user){
                const loginError = { field: "email", msg: "*No user with this email" }
                return res.render('login', { form: req.body, errors : errors.mapped(), user_type, loginError});
            }
            
            if(!(await bcrypt.compare(password, user.password))){
                const loginError = { field: "password", msg: "*Wrong password" }
                return res.render('login', { form: req.body, errors : errors.mapped(), user_type, loginError});
            }

            req.session.activeUser = user
            req.session.user_type = user_type
    
            res.redirect("/")

        } catch (error) {
            res.status(500).send("Error while getting the user." + error);
        }
        

      }
};