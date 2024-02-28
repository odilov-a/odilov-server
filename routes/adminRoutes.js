const express = require("express");
const router = express.Router();
const Vacancy = require("../models/Vacancy");
const Portfolio = require("../models/Portfolio");
const Admin = require("../models/Admin");
const About = require("../models/About");
const Blog = require("../models/Blog");
const BotBook = require("../models/BotBook");
const BotFunction = require("../models/BotFunction");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const upload = multer({ dest: "uploads/" });
const uploadsDir = path.resolve(__dirname, "uploads/");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const authenticateUser = async (username, password) => {
  try {
    const adminUser = await Admin.findOne({ username });
    if (adminUser && adminUser.password === password) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error authenticating admin user:", error);
    return false;
  }
};

const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next();
  }
  return res.redirect("/");
};

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (await authenticateUser(username, password)) {
      req.session.isAuthenticated = true;
      return res.redirect("/dashboard");
    } else {
      return res.render("login", {
        error: "Неправильное имя пользователя или пароль",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.get("/", (req, res) => {
  return res.render("login", { error: null });
});

router.get("/logout", isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    return res.redirect("/");
  });
});

router.get("/dashboard", isAuthenticated, (req, res) => {
  return res.render("adminDashboard");
});

// portfolios route codes
router.get("/portfolios", isAuthenticated, async (req, res) => {
  try {
    const portfolios = await Portfolio.find();
    return res.render("adminPortfolio", { portfolios });
  } catch (error) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.post("/portfolios/create", isAuthenticated, async (req, res) => {
  try {
    const {
      newTitle,
      newGithub,
      newPhotoLink,
      newLink,
      newDescription,
      newRole,
      newTools,
      newClient,
      newSecondPhotoLink,
    } = req.body;
    if (
      !newTitle ||
      !newPhotoLink ||
      !newLink ||
      !newRole ||
      !newTools ||
      !newGithub
    ) {
      return res.status(400).send("All inputs are required fields");
    }
    const newPortfolio = new Portfolio({
      title: newTitle,
      github: newGithub,
      photoLink: newPhotoLink,
      link: newLink,
      description: newDescription,
      role: newRole,
      tools: newTools,
      client: newClient,
      secondPhotoLink: newSecondPhotoLink,
    });
    await newPortfolio.save();
    return res.redirect("/portfolios");
  } catch (error) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.post(
  "/portfolios/update/:portfolioId",
  isAuthenticated,
  async (req, res) => {
    try {
      const portfolioId = req.params.portfolioId;
      const {
        updatedTitle,
        updatedGithub,
        updatedPhotoLink,
        updatedLink,
        updatedDescription,
        updatedRole,
        updatedTools,
        updatedClient,
        updatedSecondPhotoLink,
      } = req.body;
      if (
        !updatedTitle ||
        !updatedPhotoLink ||
        !updatedLink ||
        !updatedRole ||
        !updatedTools ||
        !updatedGithub
      ) {
        return res.status(400).send("All inputs are required fields");
      }
      const portfolio = await Portfolio.findById(portfolioId);
      if (!portfolio) {
        return res.status(404).send("Portfolio not found");
      }
      (portfolio.title = updatedTitle),
        (portfolio.github = updatedGithub),
        (portfolio.photoLink = updatedPhotoLink),
        (portfolio.link = updatedLink),
        (portfolio.description = updatedDescription),
        (portfolio.role = updatedRole),
        (portfolio.tools = updatedTools),
        (portfolio.client = updatedClient),
        (portfolio.secondPhotoLink = updatedSecondPhotoLink),
        await portfolio.save();
      return res.redirect("/portfolios");
    } catch (error) {
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

router.get(
  "/portfolios/delete/:portfolioId",
  isAuthenticated,
  async (req, res) => {
    try {
      const portfolioId = req.params.portfolioId;
      const deletedPortfolio = await Portfolio.findByIdAndDelete(portfolioId);
      if (!deletedPortfolio) {
        return res.status(404).send("Portfolio not found");
      }
      return res.redirect("/portfolios");
    } catch (error) {
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

// vacancy route codes
router.get("/vacancies", isAuthenticated, async (req, res) => {
  try {
    const vacancies = await Vacancy.find();
    return res.render("adminVacancy", { vacancies });
  } catch (error) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.get("/vacancies/:vacancyId", isAuthenticated, async (req, res) => {
  try {
    const vacancyId = req.params.vacancyId;
    const vacancy = await Vacancy.findById(vacancyId);
    if (!vacancy) {
      return res.status(404).json({ error: "Vacancy not found" });
    }
    return res.json(vacancy);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/vacancies/create", isAuthenticated, async (req, res) => {
  try {
    const { newTitle, newDescription, newPrice } = req.body;
    if (!newTitle || !newDescription || !newPrice) {
      return res.status(400).send("All fields are required");
    }
    const newVacancy = new Vacancy({
      title: newTitle,
      description: newDescription,
      price: newPrice,
    });
    await newVacancy.save();
    return res.redirect("/vacancies");
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.post(
  "/vacancies/update/:vacancyId",
  isAuthenticated,
  async (req, res) => {
    try {
      const vacancyId = req.params.vacancyId;
      const { updatedTitle, updatedDescription, updatedPrice } = req.body;
      if (!updatedTitle || !updatedDescription || !updatedPrice) {
        return res.status(400).send("All fields are required");
      }
      const vacancy = await Vacancy.findById(vacancyId);
      if (!vacancy) {
        return res.status(404).send("Vacancy not found");
      }
      vacancy.title = updatedTitle;
      vacancy.description = updatedDescription;
      vacancy.price = updatedPrice;
      await vacancy.save();
      return res.redirect("/vacancies");
    } catch (error) {
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

router.get(
  "/vacancies/delete/:vacancyId",
  isAuthenticated,
  async (req, res) => {
    try {
      const vacancyId = req.params.vacancyId;
      const deletedVacancy = await Vacancy.findByIdAndDelete(vacancyId);
      if (!deletedVacancy) {
        return res.status(404).send("Vacancy not found");
      }
      return res.redirect("/vacancies");
    } catch (error) {
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

// about route codes
router.get("/abouts", isAuthenticated, async (req, res) => {
  try {
    const abouts = await About.find();
    return res.render("adminAbout", { abouts });
  } catch (error) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.get("/abouts/:aboutId", isAuthenticated, async (req, res) => {
  try {
    const aboutId = req.params.aboutId;
    const about = await About.findById(aboutId);
    if (!about) {
      return res.status(404).json({ error: "About not found" });
    }
    return res.json(about);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/abouts/create", isAuthenticated, async (req, res) => {
  try {
    const {
      newPhoneNumber,
      newAddress,
      newInstagram,
      newTelegram,
      newLinkedIn,
      newGithub,
      newGmail,
      newPhotoLink,
      newLevel,
      newDescriptions,
    } = req.body;
    if (
      !newPhoneNumber ||
      !newAddress ||
      !newInstagram ||
      !newTelegram ||
      !newLinkedIn ||
      !newGithub ||
      !newGmail ||
      !newPhotoLink ||
      !newLevel ||
      !newDescriptions
    ) {
      return res.status(400).send("All fields are required");
    }
    const newAbout = new About({
      phoneNumber: newPhoneNumber,
      address: newAddress,
      instagram: newInstagram,
      telegram: newTelegram,
      linkedIn: newLinkedIn,
      github: newGithub,
      gmail: newGmail,
      photoLink: newPhotoLink,
      level: newLevel,
      descriptions: newDescriptions,
    });
    await newAbout.save();
    return res.redirect("/abouts");
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.post("/abouts/update/:aboutId", isAuthenticated, async (req, res) => {
  try {
    const aboutId = req.params.aboutId;
    const {
      updatedPhoneNumber,
      updatedAddress,
      updatedInstagram,
      updatedTelegram,
      updatedLinkedIn,
      updatedGithub,
      updatedGmail,
      updatedPhotoLink,
      updatedLevel,
      updatedDescriptions,
    } = req.body;
    if (
      !updatedPhoneNumber ||
      !updatedAddress ||
      !updatedInstagram ||
      !updatedTelegram ||
      !updatedLinkedIn ||
      !updatedGithub ||
      !updatedGmail ||
      !updatedPhotoLink ||
      !updatedLevel ||
      !updatedDescriptions
    ) {
      return res.status(400).send("All fields are required");
    }
    const about = await About.findById(aboutId);
    if (!about) {
      return res.status(404).send("About not found");
    }
    about.phoneNumber = updatedPhoneNumber;
    about.address = updatedAddress;
    about.instagram = updatedInstagram;
    about.telegram = updatedTelegram;
    about.linkedIn = updatedLinkedIn;
    about.github = updatedGithub;
    about.gmail = updatedGmail;
    about.photoLink = updatedPhotoLink;
    about.level = updatedLevel;
    about.descriptions = updatedDescriptions;
    await about.save();
    return res.redirect("/abouts");
  } catch (error) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.get("/abouts/delete/:aboutId", isAuthenticated, async (req, res) => {
  try {
    const aboutId = req.params.aboutId;
    const deletedAbout = await About.findByIdAndDelete(aboutId);
    if (!deletedAbout) {
      return res.status(404).send("About not found");
    }
    return res.redirect("/abouts");
  } catch (error) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

// blogs route codes
router.get("/blogs", isAuthenticated, async (req, res) => {
  try {
    const blogs = await Blog.find();
    return res.render("adminBlog", { blogs });
  } catch (error) {
    console.error(error);
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.get("/blogs/:blogId", isAuthenticated, async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "blog not found" });
    }
    return res.json(blog);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/blogs/create", isAuthenticated, async (req, res) => {
  try {
    const { newTitle, newDescription, newPhotoLink } = req.body;
    if (!newTitle || !newDescription || !newPhotoLink) {
      return res.status(400).send("All fields are required");
    }
    const newBlog = new Blog({
      title: newTitle,
      description: newDescription,
      photoLink: newPhotoLink,
    });
    await newBlog.save();
    return res.redirect("/blogs");
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.post("/blogs/update/:blogId", isAuthenticated, async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { updatedTitle, updatedDescription, updatePhotoLink } = req.body;
    if (!updatedTitle || !updatedDescription || !updatePhotoLink) {
      return res.status(400).send("All fields are required");
    }
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    blog.title = updatedTitle;
    blog.description = updatedDescription;
    blog.photoLink = updatePhotoLink;
    await blog.save();
    return res.redirect("/blogs");
  } catch (error) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.get("/blogs/delete/:blogId", isAuthenticated, async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res.status(404).send("Blog not found");
    }
    return res.redirect("/blogs");
  } catch (error) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

// botBook route codes
router.get("/books", isAuthenticated, async (req, res) => {
  try {
    const books = await BotBook.find();
    return res.render("adminBotBook", { books });
  } catch (error) {
    console.error(error);
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.get("/books/:bookId", isAuthenticated, async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const book = await BotBook.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "book not found" });
    }
    return res.json(book);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/books/create", isAuthenticated, async (req, res) => {
  try {
    const { newBookTitle, newBookDescription } = req.body;
    if (!newBookTitle || !newBookDescription) {
      return res.status(400).send("All fields are required");
    }
    const newBotBook = new BotBook({
      bookTitle: newBookTitle,
      bookDescription: newBookDescription,
    });
    await newBotBook.save();
    return res.redirect("/books");
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.post("/books/update/:bookId", isAuthenticated, async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const { updatedBookTitle, updatedBookDescription } = req.body;
    if (!updatedBookTitle || !updatedBookDescription) {
      return res.status(400).send("All fields are required");
    }
    const book = await BotBook.findById(bookId);
    if (!book) {
      return res.status(404).send("book not found");
    }
    book.bookTitle = updatedBookTitle;
    book.bookDescription = updatedBookDescription;
    await book.save();
    return res.redirect("/books");
  } catch (error) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.get("/books/delete/:bookId", isAuthenticated, async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const deletedBotBook = await BotBook.findByIdAndDelete(bookId);
    if (!deletedBotBook) {
      return res.status(404).send("Book not found");
    }
    return res.redirect("/books");
  } catch (error) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

// botBookFuction route codes
router.get("/functions", isAuthenticated, async (req, res) => {
  try {
    const bookFunctions = await BotFunction.find();
    const books = await BotBook.find();
    return res.render("adminBotFuction", { bookFunctions, books });
  } catch (error) {
    console.error(error);
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.get("/functions/:functionId", isAuthenticated, async (req, res) => {
  try {
    const functionId = req.params.functionId;
    const bookFunctions = await BotFunction.findById(functionId);
    if (!bookFunctions) {
      return res
        .status(404)
        .json({ error: "book functions Fucntion not found" });
    }
    return res.json(bookFunctions);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/functions/create",
  isAuthenticated,
  upload.single("newBookAudio"),
  async (req, res) => {
    try {
      const { newBookTitle, newBookChapter } = req.body;
      const uniqueFilename = `${uuidv4()}_${path.extname(
        req.file.originalname
      )}`;
      const destinationPath = path.resolve(
        __dirname,
        "..",
        "uploads",
        uniqueFilename
      );
      fs.renameSync(req.file.path, destinationPath);
      const newFunctionBook = new BotFunction({
        bookTitle: newBookTitle,
        bookChapter: newBookChapter,
        bookAudio: destinationPath,
      });
      await newFunctionBook.save();
      return res.redirect("/functions");
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

router.post(
  "/functions/update/:functionId",
  isAuthenticated,
  upload.single("updateBookAudio"),
  async (req, res) => {
    try {
      const functionId = req.params.functionId;
      const { updatedBookTitle, updatedBookChapter } = req.body;
      let updatedAudioPath = null;

      if (req.file) {
        const uniqueFilename = `${uuidv4()}_${path.extname(
          req.file.originalname
        )}`;
        updatedAudioPath = path.resolve(
          __dirname,
          "..",
          "uploads",
          uniqueFilename
        );
        fs.renameSync(req.file.path, updatedAudioPath);
      }

      const bookFunctions = await BotFunction.findById(functionId);
      if (!bookFunctions) {
        return res.status(404).send("Bot Function not found");
      }

      bookFunctions.bookTitle = updatedBookTitle;
      bookFunctions.bookChapter = updatedBookChapter;

      if (updatedAudioPath) {
        bookFunctions.bookAudio = updatedAudioPath;
      }

      await bookFunctions.save();
      return res.redirect("/functions");
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

router.get(
  "/functions/delete/:functionId",
  isAuthenticated,
  async (req, res) => {
    try {
      const functionId = req.params.functionId;
      const deletedFunctionBook = await BotFunction.findByIdAndDelete(
        functionId
      );
      if (!deletedFunctionBook) {
        return res.status(404).send("Bot Function not found");
      }
      return res.redirect("/functions");
    } catch (error) {
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

// users-admin route
router.get("/users", isAuthenticated, async (req, res) => {
  try {
    const users = await Admin.find();
    return res.render("adminUsers", { users });
  } catch (error) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.get("/users/:userId", isAuthenticated, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Admin.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users/update/:userId", isAuthenticated, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { updatedUsername, updatedPassword } = req.body;
    if (!updatedUsername || !updatedPassword) {
      return res.status(400).send("All fields are required");
    }
    const user = await Admin.findById(userId);
    if (!user) {
      return res.status(404).send("Admin not found");
    }
    user.username = updatedUsername;
    user.password = updatedPassword;
    await user.save();
    req.session.username = updatedUsername;
    return res.redirect("/logout");
  } catch (error) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

module.exports = router;
