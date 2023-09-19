const {
  getAllImageByFolder,
  deleteOneImage,
} = require("../middleware/uploadProduct");

const cloudinary = require("cloudinary").v2;
// Cấu hình Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
class MediaController {
  static getAllMedia = async (req, res) => {
    try {
      const data = await getAllImageByFolder("media");

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  /** add media */
  static uploadMedia = async (req, res) => {
    const { file } = req;
    try {
      if (file) res.status(200).json({ message: "upload image successfully" });
    } catch (err) {
      if (file) {
        await deleteOneImage(file.filename);
      }
      res.status(500).json(err);
    }
  };

  /** delete media */
  static deleteMedia = async (req, res) => {
    try {
      const {fileName} = req.query;
      await deleteOneImage(fileName);
      res.status(200).json({message: "delete image successfully"})
    } catch (err) {
      res.status(500).json(err);
    }
  };
}

module.exports = MediaController;
