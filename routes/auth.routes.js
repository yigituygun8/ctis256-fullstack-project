import express from "express";
import { body, validationResult } from "express-validator";
import { registerEmail, verifyEmail ,loginUser } from "../controllers/authController.js";
const router = express.Router();

// Login endpoints
router.get('/login', (req, res) => {
  const user_type = req.query.type || 'consumer'; // Default to 'consumer' if no type is provided
  res.render('login', { form : {}, errors: {}, user_type, loginError: {}});
});

router.post('/login', 
  body("email").notEmpty().withMessage("*This field must be filled"),
  body("password").notEmpty().withMessage("*This field must be filled")
  ,loginUser
);

// Register endpoints
router.get('/register', (req, res) => {
  const user_type = req.query.type ?? 'consumer'; // Default to 'consumer' if no type is provided
  res.render('register', { form : {}, errors: {}, user_type, error: {}});
});

router.post('/register', 
  body("email").notEmpty().withMessage("*This field must be filled"),
  body("password").notEmpty().withMessage("*This field must be filled"),
  body("city").notEmpty().withMessage("*This field must be filled"),
  body("district").notEmpty().withMessage("*This field must be filled"),
  body("fullName").if(body("user_type").equals("consumer")).notEmpty().withMessage("*This field must be filled"),
  body("marketName").if(body("user_type").equals("market")).notEmpty().withMessage("*This field must be filled")
  ,registerEmail
);

// Email verification endpoints
router.get('/verify-email', (req, res) => {
  // GET /verify-email
  res.render('verify', { form: {}, errors: {}})
});

router.post('/verify-email', 
  body("code").notEmpty().withMessage("*This field must be filled")
  .custom((value, {req}) => {
    if (value !== req.session.code) {
      throw new Error("*Wrong verification code");
    }
    return true;
  })
  ,verifyEmail
  // POST /verify-email
);

// Logout endpoint
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