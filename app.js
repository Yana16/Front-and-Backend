const express = require("express");
const config = require("config");
const mongoose = require("mongoose");

const app = express();
app.use("/api/auth", require("./routes/auth.routes"));

const PORT = config.get("port") || 3001;

async function start() {
  try {
    await mongoose.connect(config.get("mongoUri"));
    app.listen(PORT, () => console.log(`Hello port ${PORT}!`));
  } catch (err) {
    console.log("Server Error", err.message);
    process.exit(1);
  }
}
start();
