const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hash");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");

const isAcademicEmail = (email) => {
  return email.endsWith("@ruet.ac.bd");
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (role === "student" && !isAcademicEmail(email)) {
      return res.status(400).json({
        message: "Students must use academic email",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashed = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    // TODO: send verification email (next step)

    res.status(201).json({
      message: "User registered. Verify email before login.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
