const express = require("express");
const botFunctionController = require("../controllers/botFunctionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/", botFunctionController.getAllBotFunctions);
router.get("/:id", botFunctionController.getBotFunctionById);
router.use(authMiddleware.authenticateToken);
router.post("/", botFunctionController.createBotFunction);
router.put("/:id", botFunctionController.updateBotFunction);
router.delete("/:id", botFunctionController.deleteBotFunction);

module.exports = router;
