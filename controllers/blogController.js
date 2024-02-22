const Blog = require("../models/Blog");

exports.getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);
    const blogs = await Blog.find().skip(startIndex).limit(limit);
    const paginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      totalBlogs: totalBlogs,
    };
    return res.json({ blogs, paginationInfo });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (req.method === "GET") {
      blog.views += 1;
      await blog.save();
    }
    return res.json(blog);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const newBlog = new Blog({
      title: req.body.title,
      description: req.body.description,
      photoLink: req.body.photoLink,
    });
    const savedBlog = await newBlog.save();
    return res.json(savedBlog);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        photoLink: req.body.photoLink,
      },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.json(updatedBlog);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
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
    return res.status(500).json({ message: "Internal server error" });
  }
};
