const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "Shreyaisgoodg$irl";
var  fetchuser = require("../middleware/fetchuser");
//Route1 Create user using POST "/api/auth/createuser". Doesn't require auth.no login required createuser
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
    body("email", "Enter a valid email").isEmail(),
  ],
  async (req, res) => {
    try {
      //if there are return bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if a user with the same email already exists
      const existingUser = await User.findOne({ email: req.body.email });

      if (existingUser) {
        // Return a response indicating that the email is already in use
        return res.status(400).json({ error: "Email is already in use" });
      }
      const salt = await bcrypt.genSaltSync(10); //genrate salt
      const secPass = await bcrypt.hash(req.body.password, salt);
      const user = new User({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      console.log(authtoken);
      // Save the user to the database
      await user.save();
      res.json(authtoken);
      // res.status(201).json(user); // Return the created user as JSON
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Plsease enter unique value", message: error.message });
    }
  }
);

// Route 2Authenticate user using POST "/api/auth/login". Doesn't require auth.no login required createuser
router.post(
  "/login",
  [
    body("password", "Password cannot be blank").exists(),
    body("email", "Enter a valid email").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({"error":"Please try to login with correct credential"});
      }
      const passwordCompare =await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({"error":"Please try to login with correct credential"});
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      console.log(authtoken);
      // Save the user to the database
      res.json({authtoken});
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Internal Server Error", message: error.message });
      
    }
  }
);
//Route 3 :Get logged in user details using post "/api/auth/getUser".login required
router.post(
  "/getUser",fetchuser ,async (req, res) => {
  
 
try{
const user =await User.findById(req.user.id).select("-password");
res.send(user);
}
catch (error) {
  console.log(error);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: error.message });
  
}
}
);
module.exports = router;
