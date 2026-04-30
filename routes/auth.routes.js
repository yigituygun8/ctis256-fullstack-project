import express from "express";
import { body, validationResult } from "express-validator";
const router = express.Router();

// Login endpoints
router.get('/login', (req, res) => {

  res.render('login', { form : {}, errors: {}});
});

router.post('/login', 
  body("email").notEmpty().withMessage("*Email field must be filled"),
  body("password").notEmpty().withMessage("*Password field must be filled"),
  body("user_type").notEmpty().withMessage("*Must select at least 1 option")
  ,(req, res) => {


  const errors = validationResult(req);

  if(!errors.isEmpty()){
    //Sended errors with .mapped() for easier checking
    res.render('login', { form: req.body, errors : errors.mapped()});
  } else{
    //TO-DO: Email and Password check + user_type check

    res.redirect("/")
  }

});

// Register endpoints
router.get('/register', (req, res) => {
  // GET /register
});

router.post('/register', (req, res) => {
  // POST /register
});

// Email verification endpoints
router.get('/verify-email', (req, res) => {
  // GET /verify-email
});

router.post('/verify-email', (req, res) => {
  // POST /verify-email
});

// Logout endpoint
router.post('/logout', (req, res) => {
  // POST /logout
});

export default router;