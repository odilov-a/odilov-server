const Portfolio = require("../models/Portfolio");

exports.getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find();
    return res.json(portfolios);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    return res.json(portfolio);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createPortfolio = async (req, res) => {
  try {
    const { title, photoLink, link, description, role, tools, client, secondPhotoLink, github } = req.body;
    if (!title || !photoLink || !link || !role || !tools ||!github) {
      return res.status(400).json({ message: "All inputs are required fields" });
    }
    const newPortfolio = new Portfolio({
      title,
      github,
      photoLink,
      link,
      description,
      role,
      tools,
      client,
      secondPhotoLink,
    });
    const savedPortfolio = await newPortfolio.save();
    return res.json(savedPortfolio);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    const { title, photoLink, link, description, role, tools, client, secondPhotoLink, github } = req.body;
    if (!title || !photoLink || !link || !role || !tools || !github) {
      return res.status(400).json({ message: "All inputs are required fields" });
    }
    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { title, photoLink, link, description, role, tools, client, secondPhotoLink, github },
      { new: true }
    );
    if (!updatedPortfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    return res.json(updatedPortfolio);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deletePortfolio = async (req, res) => {
  try {
    const deletedPortfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!deletedPortfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    return res.json({ message: "Portfolio deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};