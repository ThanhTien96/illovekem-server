const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// import router to use
const postRouter = require("./src/routers/post.router");
const productRouter = require("./src/routers/product.router");
const userRouter = require("./src/routers/user.router");
const mediaRouter = require("./src/routers/media.router");
const otherFeatureRouter = require("./src/routers/otherFeature.router");
const accountRouter = require("./src/routers/account.router");
const countDocument = require("./src/routers/countDocument");
const mongodbConnection = require("./src/db/mongodb");

app.use(
  "/api/v1",
  postRouter,
  productRouter,
  userRouter,
  mediaRouter,
  otherFeatureRouter,
  accountRouter,
  countDocument
);

const PORT = process.env.SERVER_PORT || 3000;
const MONGOOSE_DB = process.env.MONGOOSE_DB;

const monogdb = new mongodbConnection(MONGOOSE_DB);
monogdb._connect();

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
