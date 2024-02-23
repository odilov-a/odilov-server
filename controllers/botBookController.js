const BotBook = require("../models/BotBook");
const handleServerError = (res, error) => {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
};

exports.getAllBotBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalBotBooks = await BotBook.countDocuments();
    const totalPages = Math.ceil(totalBotBooks / limit);
    const botBooks = await BotBook.find().skip(startIndex).limit(limit);
    const paginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      totalBotBooks: totalBotBooks,
    };
    return res.json({ botBooks, paginationInfo });
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.getBotBookById = async (req, res) => {
  try {
    const botBook = await BotBook.findById(req.params.id);
    if (!botBook) {
      return res.status(404).json({ message: "Bot book not found" });
    }
    return res.json(botBook);
  } catch (error) {
    return handleServerError(res, error);
  }
};

const validateBotBookInput = (req, res) => {
  const { newBookTitle, newBookDescription } = req.body;
  if (!newBookTitle || !newBookDescription) {
    return res.status(400).json({ message: "All inputs are required fields" });
  }
  return null;
};

exports.createBotBook = async (req, res) => {
  try {
    const validationError = validateBotBookInput(req, res);
    if (validationError) return validationError;
    const newBotBook = new BotBook({
      ...req.body,
    });
    const savedBotBook = await newBotBook.save();
    return res.json(savedBotBook);
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.updateBotBook = async (req, res) => {
  try {
    const validationError = validateBotBookInput(req, res);
    if (validationError) return validationError;
    const updatedBotBook = await BotBook.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedBotBook) {
      return res.status(404).json({ message: "BotBook not found" });
    }
    return res.json(updatedBotBook);
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.deleteBotBook = async (req, res) => {
  try {
    const deletedBotBook = await BotBook.findByIdAndDelete(req.params.id);
    if (!deletedBotBook) {
      return res.status(404).json({ message: "BotBook not found" });
    }
    return res.json({ message: "BotBook deleted successfully" });
  } catch (error) {
    return handleServerError(res, error);
  }
};
