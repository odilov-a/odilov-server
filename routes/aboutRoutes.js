const express = require("express");
const aboutController = require("../controllers/aboutController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/", aboutController.getAllAbouts);
router.get("/:id", aboutController.getAboutById);
router.use(authMiddleware.authenticateToken);
router.post("/", aboutController.createAbout);
router.put("/:id", aboutController.updateAbout);
router.delete("/:id", aboutController.deleteAbout);

module.exports = router;
