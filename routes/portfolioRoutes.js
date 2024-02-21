const express = require("express");
const portfolioController = require("../controllers/portfolioController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/", portfolioController.getAllPortfolios);
router.get("/:id", portfolioController.getPortfolioById);
router.use(authMiddleware.authenticateToken);
router.post("/", portfolioController.createPortfolio);
router.put("/:id", portfolioController.updatePortfolio);
router.delete("/:id", portfolioController.deletePortfolio);

module.exports = router;
