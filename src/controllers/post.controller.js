const { deleteImagesCloudinary } = require("../middleware/uploadProduct");
const PostModel = require("../models/post.model");
const {
  statusMessage,
  updateMessage,
  deleteMessage,
} = require("../util/message.const");

class PostController {

  static getDetailPost = async (req, res) => {
    try {
      const { id } = req.params;
      const detailPost = await PostModel.findById(id);

      res.status(200).json(detailPost);
    } catch (err) {
      res.status(500).json(errr);
    }
  };

  // get post with pagination and can get all
  static getPostPerPage = async (req, res) => {
    try {
      let { page, perPage } = req.query;

      if (page) {
        parseInt(page);
        if (page <= 0) page = 1;
        let passQuantity = Number((page - 1) * perPage);
        const post = await PostModel.find().skip(passQuantity).limit(perPage).sort({createdAt: -1});
        const total = await PostModel.countDocuments();
        const totalPage = Math.ceil(total / Number(perPage));

        return res
          .status(200)
          .json({ data: post, total, totalPage, currentPage: Number(page) });
      } else {
        const data = await PostModel.find().sort({createdAt: -1});
        return res.status(200).json(data);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };

  /** create post */
  static createPost = async (req, res) => {
    try {
      const { title, content, subContent } = req.body;
      const { files } = req;
      const newPost = await PostModel({
        title,
        content,
        subContent,
        media: files.map((ele) => ({ src: ele.path, fileName: ele.filename })),
      });
      await newPost.save();
      res.status(200).json(newPost);
    } catch (err) {
      const { files } = req;
      if (files && files.length > 0) {
        deleteImagesCloudinary(files.map((ele) => ele.filename));
      }
      res.status(500).json(err);
    }
  };

  static updatePost = async (req, res) => {
    try {
      const { id } = req.params;
      const {...updateData} = req.body;
      const {files} = req;

      const find = await PostModel.findById(id);
      if (!find) {
        if(files && files.length > 0){
          deleteImagesCloudinary(files.map(ele => ele.filename));
        };
        return res.status(404).json({ message: statusMessage.NOT_FOUND });
      }

      const oldMedia = find.media.filter((ele, index) => {
        if(ele.fileName) {
          return ele.fileName
        }
      });

      if(files && files.length > 0) {
        await deleteImagesCloudinary(oldMedia.map(ele => ele.fileName));

        let updateMedia = [];
        for (let i in files) {
          updateMedia.push({
            src: files[i].path,
            fileName: files[i].filename
          })
        }
        updateData.media = updateMedia
      }


      await find.updateOne({ $set: updateData});

      res.status(200).json({ messate: updateMessage.SUCCESS });
    } catch (err) {
      const { files } = req;
      if (files && files.length > 0) {
        deleteImagesCloudinary(files.map((ele) => ele.filename));
      }
      res.status(500).json(err);
    }
  };

  static deletePost = async (req, res) => {
    try {
      const { id } = req.params;

      const find = await PostModel.findById(id);
      if (!find)
        return res.status(404).json({ message: statusMessage.NOT_FOUND });

      const mediaList = find.media.filter(ele => {
        if(ele.fileName) {
          return ele.fileName
        }
      })

      if(mediaList.length > 0) {
        await deleteImagesCloudinary(mediaList.map(ele => ele.fileName));
      }
      await PostModel.findByIdAndDelete(id);
      res.status(200).json({ message: deleteMessage.SUCCESS });
    } catch (err) {
      res.status(500).json(err);
    }
  };
}

module.exports = PostController;
