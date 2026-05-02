import express from "express";
import { body, validationResult } from "express-validator";
const router = express.Router();

// Login endpoints
router.get('/login', (req, res) => {
  const user_type = req.query.type || 'consumer'; // Default to 'consumer' if no type is provided
  res.render('login', { form : {}, errors: {}, user_type});
});

router.post('/login', 
  body("email").notEmpty().withMessage("*This field must be filled"),
  body("password").notEmpty().withMessage("*This field must be filled")
  ,(req, res) => {

  const user_type = req.body.user_type || req.query.type || 'consumer';

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    //Sended errors with .mapped() for easier checking
    res.render('login', { form: req.body, errors : errors.mapped(), user_type});
  } else{
    //TO-DO: Email and Password check

    res.redirect("/")
  }

});

// Register endpoints
router.get('/register', (req, res) => {
  const user_type = req.query.type ?? 'consumer'; // Default to 'consumer' if no type is provided
  res.render('register', { form : {}, errors: {}, user_type});
});

router.post('/register', 
  body("email").notEmpty().withMessage("*This field must be filled"),
  body("password").notEmpty().withMessage("*This field must be filled"),
  body("city").notEmpty().withMessage("*This field must be filled"),
  body("district").notEmpty().withMessage("*This field must be filled"),
  body("fullName").if(body("user_type").equals("consumer")).notEmpty().withMessage("*This field must be filled"),
  body("marketName").if(body("user_type").equals("market")).notEmpty().withMessage("*This field must be filled")
  ,(req, res) => {
  
  const errors = validationResult(req);
  const user_type = req.body.user_type || req.query.type || 'consumer';

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