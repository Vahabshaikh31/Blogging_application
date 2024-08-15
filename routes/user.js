const { Router } = require("express");
const user = require("../models/user");
const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .render("signup", { error: "Email already in use" });
    }

    await user.create({
      fullName,
      email,
      password,
    });

    return res.redirect("/signin"); // Redirect to signin page after signup
  } catch (err) {
    console.error("Error during signup:", err.message);
    return res
      .status(500)
      .render("signup", { error: "An error occurred during signup" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate user credentials and generate token
    const token = await user.matchPasswordAndGenerateToken(email, password);

    // Set cookie with the token and redirect to homepage
    return res.cookie("token", token).redirect("/");
  } catch (err) {
    console.error("Error during signin:", err.message);
    return res
      .status(400)
      .render("signin", { error: "Invalid email or password" });
  }
});

router.get("/logout", async (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
