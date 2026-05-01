import express from "express";
import { body, validationResult } from "express-validator";
const router = express.Router();

// Login endpoints
router.get('/login', (req, res) => {

  res.render('login', { form : {}, errors: {}});
});

router.post('/login', 
  body("email").notEmpty().withMessage("*This field must be filled"),
  body("password").notEmpty().withMessage("*This field must be filled")
  ,(req, res) => {


  const errors = validationResult(req);

  if(!errors.isEmpty()){
    //Sended errors with .mapped() for easier checking
    res.render('login', { form: req.body, errors : errors.mapped()});
  } else{
    //TO-DO: Email and Password check

    res.redirect("/")
  }

});

// Register endpoints
router.get('/register', (req, res) => {
  const user_type = req.query.type ?? 'cust';
  res.render('register', { form : {}, errors: {}, user_type});
});

router.post('/register', 
  body("email").notEmpty().withMessage("*This field must be filled"),
  body("password").notEmpty().withMessage("*This field must be filled"),
  body("city").notEmpty().withMessage("*This field must be filled"),
  body("district").notEmpty().withMessage("*This field must be filled"),
  body("fullName").if(body("user_type").equals("cust")).notEmpty().withMessage("*This field must be filled"),
  body("marketName").if(body("user_type").equals("market")).notEmpty().withMessage("*This field must be filled")
  ,(req, res) => {
  
  const errors = validationResult(req);
  const user_type = req.body.user_type || req.query.type || 'cust';

  if(!errors.isEmpty()){
    //Sended errors with .mapped() for easier checking
    res.render('register', { form: req.body, errors : errors.mapped(), user_type});
  } else{
    //TO-DO: Verification

    res.redirect("/")
  }
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