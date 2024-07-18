let mongoose = require("mongoose");
class Database {
  mongoUri = "";
  constructor(uri) {
    this.mongoUri = uri
  }
  _connect() {
    mongoose
      .connect(`${this.mongoUri}`)
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.error("Database connection error");
      });
  }
}

module.exports = Database;
