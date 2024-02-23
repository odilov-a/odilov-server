const express = require("express");
const botBookController = require("../controllers/botBookController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/", botBookController.getAllBotBooks);
router.get("/:id", botBookController.getBotBookById);
router.use(authMiddleware.authenticateToken);
router.post("/", botBookController.createBotBook);
router.put("/:id", botBookController.updateBotBook);
router.delete("/:id", botBookController.deleteBotBook);

module.exports = router;
