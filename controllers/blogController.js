const Blog = require("../models/Blog");
const handleServerError = (res, error) => {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
};

exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;
    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);
    const blogs = await Blog.find().skip(startIndex).limit(limit);
    const paginationInfo = {
      currentPage: page,
      totalPages,
      totalBlogs,
    };
    return res.json({ blogs, paginationInfo });
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (req.method === "GET") {
      blog.views = (blog.views || 0) + 1;
      await blog.save();
    }
    return res.json(blog);
  } catch (error) {
    return handleServerError(res, error);
  }
};

const validateBlogInput = (req, res) => {
  const { title, description, photoLink } = req.body;
  if (!(title && description && photoLink)) {
    return res.status(400).json({ message: "Title, description, and photoLink are required fields" });
  }
  return null;
};

exports.createBlog = async (req, res) => {
  try {
    const validationError = validateBlogInput(req, res);
    if (validationError) return validationError;
    const newBlog = new Blog({
      ...req.body,
    });
    const savedBlog = await newBlog.save();
    return res.json(savedBlog);
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const validationError = validateBlogInput(req, res);
    if (validationError) return validationError;
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.json(updatedBlog);
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    return handleServerError(res, error);
  }
};