const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Admin = require("../models/Admin");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const adminUser = await Admin.findOne({ username });
    if (adminUser && adminUser.password === password) {
      const accessToken = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.json({ accessToken });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error checking admin user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;