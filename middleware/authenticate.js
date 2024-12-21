import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided. Access denied." });
    }

    // Verify the token and extract user data
    const decoded = jwt.verify(
      token,
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    );
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user data to the request object
    req.user = decoded;

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

export default authenticate;
