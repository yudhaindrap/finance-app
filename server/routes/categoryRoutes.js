const express = require("express");
const router = express.Router();
const { getCategories, createCategory, deleteCategory, seedCategories } = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getCategories);
router.post("/", authMiddleware, createCategory);
router.delete("/:id", authMiddleware, deleteCategory);
router.post("/seed", authMiddleware, seedCategories);

module.exports = router;
