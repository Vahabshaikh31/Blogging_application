const express = require("express");
const path = require("path");
const app = express();
const userRouter = require("./routes/user");
const { default: mongoose } = require("mongoose");
const port = 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));

const uri =
  "mongodb+srv://vahabs:Svahab3101@cluster0.jb9arqn.mongodb.net/blogify?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/user", userRouter);

app.listen(port, () => console.log(` app listening on port ${port}!`));
