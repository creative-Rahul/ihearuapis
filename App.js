const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true })); //for parsing body of HTML Forms
app.use(express.static("./public")); //for serving static contenct in public folder
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.use(morgan("tiny"));
// app.use("/api/buyer", buyerRoutes);
// app.use("/api/vendor", vendorRoutes);
const adminRoutes = require("./routes/adminRoutes")
app.use("/api/admin", adminRoutes);

process.env.BASE_URL = "http://localhost:3009";

app.get("/", (req, res) => {
  console.log("Hello");
  res.status(200).send("hello from the server");
});

module.exports = app;
