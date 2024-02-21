const express = require("express");
const vacancyController = require("../controllers/vacancyController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/", vacancyController.getAllVacancies);
router.get("/:id", vacancyController.getVacancyById);
router.use(authMiddleware.authenticateToken);
router.post("/", vacancyController.createVacancy);
router.put("/:id", vacancyController.updateVacancy);
router.delete("/:id", vacancyController.deleteVacancy);

module.exports = router;
