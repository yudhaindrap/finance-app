const express = require("express");
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
  getSummary,
  getMonthlyStats,
} = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", getTransactions);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);
router.put("/:id", updateTransaction);
router.get("/summary", getSummary);
router.get("/stats/monthly", getMonthlyStats);

module.exports = router;
