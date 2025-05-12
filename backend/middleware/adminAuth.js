
import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ success: false, message: "Token is missing!" });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the email matches the admin's email from the environment variable
    if (decodedToken.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ success: false, message: "Unauthorized!" });
    }

    // If valid, proceed to the next middleware
    next();
  } catch (error) {
    console.log("Error while authenticating admin: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default adminAuth;
