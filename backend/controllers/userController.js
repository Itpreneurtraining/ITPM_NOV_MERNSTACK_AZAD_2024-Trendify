import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";

// INFO: Function to create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// INFO: Route for user login
// METHOSD: POST http://localhost:8000/api/user/login
// {
//   "email": "nilesh1@example.com",
//   "password": "nileshPass123"
// }

const loginUser = async (req, res) => {
    try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      const token = createToken(user._id);

      // INFO: Return success response  
      res.status(200).json( { message: "user is successfully logged ",success: true, token });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
  }  catch (error) {
     console.log("Error while logging in user: ", error);
     res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for user registration
//  METHOSD: POST http://localhost:8000/api/user/register
// {
//   "name": "nilesh1",
//   "email": "nilesh1@example.com",
//   "password": "nileshPass123"
// }



const registerUser = async (req, res) => {
  try {
      const { name, email, password } = req.body;

    // INFO: Check if user already exists
      const userExists = await userModel.findOne({ email });
      if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // INFO: Validating email and password
      if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
      if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // INFO: Hashing user password
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, salt);

    // INFO: Create new user
      const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    // INFO: Save user to database
    const user = await newUser.save();

    // INFO: Create token
    const token = createToken(user._id);

    // INFO: Return success response
    res.status(200).json({ message: "user created successfully  ", 
        success: true,
        name,
        email ,
        token });


        
  } catch (error) {
    console.log("Error while registering user: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for admin login


const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email, password },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({ success: true, token });
    }

    res.status(401).json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    console.log("Error while logging in admin: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, loginAdmin };
