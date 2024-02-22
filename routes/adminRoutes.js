const express = require("express");
const router = express.Router();
const Vacancy = require("../models/Vacancy");
const Portfolio = require("../models/Portfolio");
const Admin = require("../models/Admin");
const About = require("../models/About");

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
    console.error("Error fetching portfolios:", error);
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
    console.error("Error creating portfolio:", error);
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
      console.error("Error updating portfolio:", error);
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
      console.error("Error deleting portfolio:", error);
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
    console.error(error);
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
    console.error("Error fetching vacancy details:", error);
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
      console.error(error);
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
    console.error(error);
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
    console.error("Error fetching about details:", error);
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
    console.error(error);
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

router.get("/users", isAuthenticated, async (req, res) => {
  try {
    const users = await Admin.find();
    return res.render("adminUsers", { users });
  } catch (error) {
    console.error(error);
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
    console.error("Error fetching user details:", error);
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
    console.error(error);
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

module.exports = router;
