import express from "express";
import { body, validationResult } from "express-validator";
import { registerEmail, verifyEmail ,loginUser } from "../controllers/authController.js";
const router = express.Router();

// GET login form
router.get('/login', (req, res) => {
  if(req.session.user) {
    req.session.status = { isSuccess: false, msg: "You are already logged in!" };
    return res.redirect('/');
  }
  const user_type = req.query.type || 'consumer'; // Default to 'consumer' if no type is provided
  const status = req.session.status;
  delete req.session.status;
  res.render('login', { form : {}, errors: {}, user_type, loginError: {}, status});
});

// Handle login - validate input and then log the user in with loginUser controller
router.post('/login', 
  body("email").notEmpty().withMessage("*This field must be filled"),
  body("password").notEmpty().withMessage("*This field must be filled")
  ,loginUser
);

// GET registration form
router.get('/register', (req, res) => {
  if(req.session.user) {
    req.session.status = { isSuccess: false, msg: "You are already registered!" };
    return res.redirect('/');
  }
  const user_type = req.query.type ?? 'consumer'; // Default to 'consumer' if no type is provided
  res.render('register', { form : {}, errors: {}, user_type, exists: {}});
});

// Handle registration - validate input and then create the user with registerEmail controller
router.post('/register', 
  body("email").notEmpty().withMessage("*This field must be filled"),
  body("email").isEmail().withMessage("*This is not a valid email"),
  body("password").notEmpty().withMessage("*This field must be filled"),
  body("city").notEmpty().withMessage("*This field must be filled"),
  body("district").notEmpty().withMessage("*This field must be filled"),
  body("fullName").if(body("user_type").equals("consumer")).notEmpty().withMessage("*This field must be filled"),
  body("marketName").if(body("user_type").equals("market")).notEmpty().withMessage("*This field must be filled")
  ,registerEmail
);

// Email verification endpoint - GET
router.get('/verify-email', (req, res) => {
  // Check if there is a user to verify in the session, if not redirect to register
  if(!req.session.code || !req.session.user_to_verify) {
    return res.redirect("/register");
  }
  res.render('verify', { form: {}, errors: {}})
});

// Handle email verification - POST
router.post('/verify-email', 
  body("code").notEmpty().withMessage("*This field must be filled")
  .custom((value, {req}) => {
    if (value !== req.session.code) {
      throw new Error("*Wrong verification code");
    }
    return true;
  })
  ,verifyEmail
);

// Logout endpoint - clears the session and redirects to the homepage
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error while logging out.");
    } else {
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.redirect('/');
    }
  });
});

export default router;