const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

// Cấu hình Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ilovekem/product",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

const uploadCloudProduct = multer({ storage });

const newsStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ilovekem/news",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

const uploadNewsImages = multer({ storage: newsStorage });

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ilovekem/avatar",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

const uploadAvatar = multer({ storage: avatarStorage });

const mediaStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ilovekem/media",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  }
});

const uploadMediaCloud = multer({storage: mediaStorage});

/** get media by folder name */
const getAllImageByFolder = async (folderName) => {
  try {
    const data = await cloudinary.search
      .expression(`folder:ilovekem/${folderName}`)
      .execute();

      return data;
  } catch (err) {
    throw new Error(err);
  }
};

/** delete many img */
const deleteImagesCloudinary = async (fileNames) => {
  try {
    const deleteImg = await Promise.all(
      fileNames.map(async (ele) => {
        return await cloudinary.uploader.destroy(ele);
      })
    );

    const allResult = deleteImg.every((res) => res.result === "ok");

    if (allResult) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new Error(err);
  }
};

/** delete one img */
const deleteOneImage = async (fileName) => {
  try {
    const deleteImg = await cloudinary.uploader.destroy(fileName);

    if (deleteImg.result === "ok") {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  uploadCloudProduct,
  uploadNewsImages,
  uploadAvatar,
  uploadMediaCloud,
  getAllImageByFolder,
  deleteOneImage,
  deleteImagesCloudinary,
};
