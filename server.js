require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const xss = require("xss-clean");
const helmet = require("helmet");
const userRoutes = require("./routes/userRoutes");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(xss());
app.use(helmet());
app.use("/api/user", userRoutes);
const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log("server up and running on PORT :", port);
});
