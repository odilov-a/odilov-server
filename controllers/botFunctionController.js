const BotFunction = require("../models/BotFunction");
const handleServerError = (res, error) => {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
};

exports.getAllBotFunctions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalBotFunctions = await BotFunction.countDocuments();
    const totalPages = Math.ceil(totalBotFunctions / limit);
    const botFunctions = await BotFunction.find().skip(startIndex).limit(limit);
    const paginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      totalBotFunctions: totalBotFunctions,
    };
    return res.json({ botFunctions, paginationInfo });
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.getBotFunctionById = async (req, res) => {
  try {
    const botFunction = await BotFunction.findById(req.params.id);
    if (!botFunction) {
      return res.status(404).json({ message: "BotFunction not found" });
    }
    return res.json(botFunction);
  } catch (error) {
    return handleServerError(res, error);
  }
};

const validateBotFunctionInput = (req, res) => {
  const { bookTitle, bookChapter, bookAudio } = req.body;
  if (!bookTitle || !bookChapter || !bookAudio) {
    return res.status(400).json({ message: "All inputs are required fields" });
  }
  return null;
};

exports.createBotFunction = async (req, res) => {
  try {
    const validationError = validateBotFunctionInput(req, res);
    if (validationError) return validationError;
    const newBotFunction = new BotFunction({
      ...req.body,
    });
    const savedBotFunction = await newBotFunction.save();
    return res.json(savedBotFunction);
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.updateBotFunction = async (req, res) => {
  try {
    const validationError = validateBotFunctionInput(req, res);
    if (validationError) return validationError;
    const updatedBotFunction = await BotFunction.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedBotFunction) {
      return res.status(404).json({ message: "BotFunction not found" });
    }
    return res.json(updatedBotFunction);
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.deleteBotFunction = async (req, res) => {
  try {
    const deletedBotFunction = await BotFunction.findByIdAndDelete(
      req.params.id
    );
    if (!deletedBotFunction) {
      return res.status(404).json({ message: "BotFunction not found" });
    }
    return res.json({ message: "BotFunction deleted successfully" });
  } catch (error) {
    return handleServerError(res, error);
  }
};
