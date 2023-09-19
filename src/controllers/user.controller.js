const AuthService = require("../middleware/auth.middleware");
const {
  deleteImagesCloudinary,
  deleteOneImage,
} = require("../middleware/uploadProduct");
const { UserTypeModel, UserModel } = require("../models/user.model");
const {
  createMessage,
  statusMessage,
  updateMessage,
  deleteMessage,
} = require("../util/message.const");

class UserTypeController {
  /** get all */
  static getAll = async (req, res) => {
    try {
      const userType = await UserTypeModel.find().sort({ role: "asc" });
      const data = userType.map((ele) => ({
        _id: ele._id,
        typeName: ele.typeName,
        role: ele.role,
      }));
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  /** get detail */
  static getDetail = async (req, res) => {
    try {
      const { id } = req.params;
      const findType = await UserTypeModel.findById(id);
      if (!findType) {
        return res.status(404).json({ message: statusMessage.NOT_FOUND });
      }
      const data = {
        _id: findType._id,
        typeName: findType.typeName,
        role: findType.role,
      };
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  /** create user type */
  static createUserType = async (req, res) => {
    try {
      const { typeName, role } = req.body;
      const findName = await UserTypeModel.find({ typeName });
      if (findName.length > 0)
        return res.status(400).json({ message: "type already exist" });
      const findRole = await UserTypeModel.find({ role: Number(role) });
      if (findRole.length > 0)
        return res.status(400).json({ message: "role already exist" });
      const newUserType = await UserTypeModel({ typeName, role: Number(role) });
      await newUserType.save();
      res.status(200).json({ message: createMessage.SUCCESS });
    } catch (err) {
      res.status(500).json(err);
    }
  };

  /** udpate type */
  static updateType = async (req, res) => {
    try {
      const { id } = req.params;
      const find = await UserTypeModel.findById(id);
      if (!find)
        return res.status(404).json({ message: statusMessage.NOT_FOUND });
      await find.updateOne({ $set: req.body });
      res.status(200).json({ message: updateMessage.SUCCESS });
    } catch (err) {
      res.status(500).json(err);
    }
  };

  /** delete type */
  static deleteType = async (req, res) => {
    try {
      const { id } = req.params;
      const find = await UserTypeModel.findById(id);
      if (!find) {
        return res.status(404).json({ message: statusMessage.NOT_FOUND });
      }
      await UserTypeModel.findByIdAndDelete(id);
      res.status(200).json({ message: deleteMessage.SUCCESS });
    } catch (err) {
      res.status(500).json(err);
    }
  };
}

class UserController {
  /** get all */
  static getAllUser = async (req, res) => {
    try {
      const { page, perPage } = req.query;
      if (page && perPage) {
        if (Number(page) <= 0) page = 1;
        if (Number(perPage) <= 0) perPage = 10;

        let passQuantity = Number(page - 1) * Number(perPage);
        const total = await UserModel.countDocuments();
        const totalPage = Math.ceil(total / Number(perPage));

        const user = await UserModel.find()
          .skip(passQuantity)
          .limit(Number(perPage))
          .populate("userType");

        res.status(200).json(user);
      } else {
        const allUser = await UserModel.find().populate("userType");
        res.status(200).json(allUser);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };

  /** get detail user */
  static getDetailUser = async (req, res) => {
    try {
      const { id } = req.params;

      const findUser = await UserModel.findById(id).populate("userType");
      if (!findUser)
        return res.status(404).json({ message: statusMessage.NOT_FOUND });
      res.status(200).json(findUser);
    } catch (err) {
      res.status(500).json(err);
    }
  };
  /** create user */
  static createUser = async (req, res) => {
    try {
      const { file } = req;
      const { userType, ...dataCreate } = req.body;

      const findUserName = await UserModel.find({
        userName: dataCreate.userName,
      });
      if (findUserName.length > 0)
        return res.status(400).json({ message: "user name already exist" });

      const findEmail = await UserModel.find({ email: dataCreate.email });
      if (findEmail.length > 0)
        return res.status(400).json({ message: "email already exist" });

      const findUserType = await UserTypeModel.findById(userType);

      if (!findUserType)
        return res.status(404).json({ message: "user type is not found" });

      const hassedPassword = await AuthService.hassPassword(
        dataCreate.password
      );

      const newUser = await UserModel({
        ...dataCreate,
        password: hassedPassword,
        avatar: { src: file.path, fileName: file.filename },
      });
      (newUser.userType = {
        _id: findUserType.id,
        typeName: findUserType.typeName,
        role: findUserType.role,
      }),
        await newUser.save();

      findUserType.users.push(newUser);
      await findUserType.save();
      res.status(200).json({ message: createMessage.SUCCESS });
    } catch (err) {
      if (req.file) {
        await deleteOneImage(file.filename);
      }
      res.status(500).json(err);
    }
  };

  /** update user */
  static updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { userType, ...dataUpdate } = req.body;
      const { file } = req;
      const findUser = await UserModel.findById(id);

      if (!findUser) return res.status(404).json({ message: "User not found" });

      // Kiểm tra email trùng lặp
      if (dataUpdate.email) {
        const findEmailUser = await UserModel.findOne({
          email: dataUpdate.email,
        });
        if (
          findEmailUser &&
          findUser._id.toString() !== findEmailUser._id.toString()
        ) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }

      // Kiểm tra userName trùng lặp
      if (dataUpdate.userName) {
        const findUserNameUser = await UserModel.findOne({
          userName: dataUpdate.userName,
        });
        if (
          findUserNameUser &&
          findUser._id.toString() !== findUserNameUser._id.toString()
        ) {
          return res.status(400).json({ message: "Username already exists" });
        }
      }

      let findUserType;

      if (userType) {
        findUserType = await UserTypeModel.findById(userType);

        if (!findUserType) {
          if (file) {
            await deleteOneImage(file.filename);
          }
          return res.status(404).json({ message: "User type not found" });
        }
      }

      if (file && findUser.avatar.fileName) {
        await deleteOneImage(findUser.avatar.fileName);
      }

      const updateFields = {
        ...dataUpdate,
        password:
          dataUpdate?.password && AuthService.hassPassword(dataUpdate.password),
      };

      if (file) {
        updateFields.avatar = { src: file.path, fileName: file.filename };
      }

      if (userType) {
        // Nếu có userType, cập nhật userType cho người dùng
        updateFields.userType = userType;
      } else if (findUser.userType) {
        // Nếu không có userType mới, nhưng người dùng đã có userType, xóa liên kết với userType cũ
        const oldUserType = await UserTypeModel.findById(findUser.userType);
        if (oldUserType) {
          const indexOfUser = oldUserType.users.indexOf(id);
          if (indexOfUser !== -1) {
            oldUserType.users.splice(indexOfUser, 1);
            await oldUserType.save();
          }
        }
      }

      const updateUser = await UserModel.findByIdAndUpdate(
        id,
        {
          $set: updateFields,
        },
        {
          new: true,
        }
      );

      if (!updateUser)
        return res.status(404).json({ message: "Update failed" });

      if (userType) {
        // Cập nhật người dùng trong userType mới (nếu có)
        findUserType.users.push(updateUser);
        await findUserType.save();
      }

      res.status(200).json({ message: "Update successful" });
    } catch (err) {
      const { file } = req;
      if (file) {
        await deleteOneImage(file.filename);
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };

  /** delete user */
  static deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const findUser = await UserModel.findById(id);
      if (!findUser) return res.status(404).json(err);

      if (findUser.avatar && findUser.avatar.fileName) {
        await deleteOneImage(findUser.avatar.fileName);
      }

      await UserTypeModel.findByIdAndUpdate(findUser.userType._id, {
        $pull: { users: id },
      });

      await UserModel.findByIdAndDelete(id);
      res.status(200).json({message: deleteMessage.SUCCESS});
    } catch (err) {
      res.status(500).json(err);
    }
  };
}

module.exports = {
  UserTypeController,
  UserController,
};
