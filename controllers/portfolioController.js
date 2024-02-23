const Portfolio = require("../models/Portfolio");
const handleServerError = (res, error) => {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
};

exports.getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find();
    return res.json(portfolios);
  } catch (error) {
    return handleServerError(res, error);
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
    return handleServerError(res, error);
  }
};

const validatePortfolioInput = (req, res) => {
  const { title, photoLink, link, role, tools, github } = req.body;
  if (!title || !photoLink || !link || !role || !tools || !github) {
    return res.status(400).json({ message: "All inputs are required fields" });
  }
  return null;
};

exports.createPortfolio = async (req, res) => {
  try {
    const validationError = validatePortfolioInput(req, res);
    if (validationError) return validationError;
    const newPortfolio = new Portfolio({
      ...req.body,
    });
    const savedPortfolio = await newPortfolio.save();
    return res.json(savedPortfolio);
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    const validationError = validatePortfolioInput(req, res);
    if (validationError) return validationError;
    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedPortfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    return res.json(updatedPortfolio);
  } catch (error) {
    return handleServerError(res, error);
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
    return handleServerError(res, error);
  }
};