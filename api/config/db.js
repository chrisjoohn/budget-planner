const mongoose = require("mongoose");

const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

db.on("error", () => {
  console.log("ERROR in database connection!");
});

db.on("connected", function () {
  console.log("Connected to database!");
});

module.exports = db;
