const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongooseDB = require("mongoose");


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());



// import router to use
const postRouter = require("./src/routers/post.router");
const productRouter = require('./src/routers/product.router');
const userRouter = require('./src/routers/user.router');
const mediaRouter = require('./src/routers/media.router');
const otherFeatureRouter = require('./src/routers/otherFeature.router')
const accountRouter = require('./src/routers/account.router');

app.use("/api/v1", postRouter, productRouter, userRouter, mediaRouter, otherFeatureRouter, accountRouter);

const PORT = process.env.SERVER_PORT || 8000;
const MONGOOSE_DB = process.env.MONGOOSE_DB;
mongooseDB.set("strictQuery", true);
mongooseDB
  .connect(MONGOOSE_DB, { useNewUrlParser: true })
  .then(() => {
    console.log("connect db successfully!");
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
