const express = require("express");
const blogController = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
// router.use(authMiddleware.authenticateToken);
router.post("/", blogController.createBlog);
router.put("/:id", blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

module.exports = router;
