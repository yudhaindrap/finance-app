const User = require("../models/User");
const Category = require("../models/Category");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // cek email terdaftar
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // simpan user
    const newUser = await User.create({ name, email, password: hashed });

    // ⬇️ Tambahkan kategori default
    const defaultCategories = [
      { name: "Gaji", type: "income" },
      { name: "Bonus", type: "income" },
      { name: "Investasi", type: "income" },
      { name: "Makan", type: "expense" },
      { name: "Transportasi", type: "expense" },
      { name: "Belanja", type: "expense" },
      { name: "Hiburan", type: "expense" },
    ];

    const categoriesWithUser = defaultCategories.map((cat) => ({
      ...cat,
      user: newUser._id,
    }));

    await Category.insertMany(categoriesWithUser);

    // buat token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // cari user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // buat token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
