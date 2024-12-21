import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate request body
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Create a new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    // res.redirect("/index.html");

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
};

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Check if password is correct using a method from your User schema
    const rightpass = await user.isPasswordCorrect(password); // Assuming you have defined this method

    if (!rightpass) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // Generate access token
    const accessToken = jwt.sign(
      { userId: user._id, username: user.username }, // You can include other details here if needed
      process.env.JWT_SECRET, // Replace with environment variable
      { expiresIn: "5h" }
    );

    // Send the response with the token
    return res.status(200).json({
      message: "Login successful",
      accessToken, // Send the access token
      userId: user._id, // Optionally return user details
      username: user.username,
    });
  } catch (err) {
    console.error("Login error:", err); // Log any errors
    return res.status(500).json({ error: "Error logging in user" });
  }
};

//fetch user data

const currentUser = async (req, res) => {
  const { userId, username } = req.user;

  res.status(200).json({ userId, username });
};

export { registerUser, loginUser, currentUser };
