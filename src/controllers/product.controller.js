const { deleteImagesCloudinary } = require("../middleware/uploadProduct");
const { ProductTypeModel, ProductModel } = require("../models/product.model");
const {
  createMessage,
  statusMessage,
  updateMessage,
  deleteMessage,
} = require("../util/message.const");

/** product type controller reletionship one to many with product */
class ProductTypeController {
  /** get all method */
  static getAllProductType = async (req, res) => {
    try {
      const productType = await ProductTypeModel.find().sort({role: "asc"});
      const data = productType.map((ele) => ({
        _id: ele._id,
        typeName: ele.typeName,
        role: ele.role,
      }));
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  /** get detail method */
  static getDetailProductType = async (req, res) => {
    try {
      const { id } = req.params;
      const findType = await ProductTypeModel.findById(id);
      if (!findType)
        return res.status(404).json({ message: statusMessage.NOT_FOUND });

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

  // get product with product type
  static getProductTypeWithProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const { page, perPage } = req.query;
      if (page && perPage) {
        if (Number(page) <= 0) page = 1;
        if (Number(perPage) <= 0) perPage = 1;

        // Tính toán tổng số sản phẩm trong toàn bộ productType
        const totalProducts = await ProductModel.countDocuments({
          productType: id,
        });

        let passQuantity = Number((page - 1) * perPage);

        // Tìm loại sản phẩm dựa trên ID và populate thông tin sản phẩm
        const findType = await ProductTypeModel.findById(id).populate({
          path: "products",
          options: {
            skip: passQuantity,
            limit: Number(perPage),
            sort: { createdAt: -1 }, // Sắp xếp theo createdAt giảm dần (gần nhất đến xa nhất)
          },
        });

        if (!findType) {
          return res.status(404).json({ message: statusMessage.NOT_FOUND });
        }

        // Lấy danh sách sản phẩm
        const productList = findType.products;

        // Tính toán tổng số trang dựa trên số sản phẩm và số sản phẩm trên mỗi trang
        const totalPage = Math.ceil(totalProducts / Number(perPage));

        res.status(200).json({
          data: productList,
          total: totalProducts, // Tổng số sản phẩm trong productType
          totalPage: totalPage,
          currentPage: Number(page),
        });
      } else {
        const findType = await ProductTypeModel.findById(id).populate({
          path: "products",
          options: { sort: { createdAt: -1 } }, // Sắp xếp theo createdAt giảm dần
        });
        if (!findType)
          return res.status(404).json({ message: statusMessage.NOT_FOUND });
        res.status(200).json(findType.products);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };

  /** create method */
  static createProductType = async (req, res) => {
    try {
      const { typeName, role } = req.body;

      // Tìm kiếm xem đã tồn tại typeName trong database chưa
      const existingType = await ProductTypeModel.findOne({ typeName });

      if (existingType) {
        return res.status(400).json({ message: createMessage.EXISTING });
      }

      // Tạo một instance mới của ProductTypeModel
      const newProductType = new ProductTypeModel({ typeName, role });

      // Lưu dữ liệu vào database
      await newProductType.save();

      res.status(200).json({ message: createMessage.SUCCESS });
    } catch (err) {
      res.status(500).json(err);
    }
  };

  /** update method */
  static updateProductType = async (req, res) => {
    try {
      const { id } = req.params;
      /** find type */
      const findType = await ProductTypeModel.findById(id);
      /** throw err if not exist */
      if (!findType) res.status(404).json({ message: statusMessage.NOT_FOUND });

      /** udpate */
      await findType.updateOne({ $set: req.body });
      res.status(200).json({ message: updateMessage.SUCCESS });
    } catch (err) {
      res.status(500).json(err);
    }
  };

  /** delete method */
  static deleteProductType = async (req, res) => {
    try {
      const { id } = req.params;
      await ProductTypeModel.findByIdAndDelete(id);
      res.status(200).json({ message: deleteMessage.SUCCESS });
    } catch (err) {
      res.status(500).json(err);
    }
  };
}

/** product controller */
class ProductController {
  /** get all product  */

  static getAllProducts = async (req, res) => {
    try {
      const { page, perPage } = req.query;
      
      if (page && perPage) {
        if(Number(page) <= 0) page = 1;
        if(Number(perPage) <= 0) perPage = 10;
        
        let passQuantity = (Number(page) - 1) * Number(perPage);
        const total = await ProductModel.countDocuments();
        const totalPage = Math.ceil(total / Number(perPage));

        const data = await ProductModel.find().skip(passQuantity).limit(perPage).sort({createdAt: -1}).populate('productType');
        res.status(200).json({data, total, totalPage, currentPage: page});
      } else {
        // Lấy tất cả sản phẩm
        const products = await ProductModel.find().populate("productType");

        res.status(200).json(products);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  };

  /** get detail */
  static getDetailProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const findProduct = await ProductModel.findById(id).populate('productType');
      if (!findProduct)
        return res.status(404).json({ message: statusMessage.NOT_FOUND });
     
      res.status(200).json(findProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  /** create product */
  static createProduct = async (req, res) => {
    try {
      const { files } = req;
      const { productType, ...productData } = req.body;
      // Tìm loại sản phẩm
      const findType = await ProductTypeModel.findById(productType);
      if (!findType) return res.status(404).json({ message: "Type not found" });

      const img = files.map((ele) => ({
        fileName: ele.filename,
        src: ele.path,
      }));
      // Tạo một sản phẩm và lưu vào cơ sở dữ liệu
      const newProduct = new ProductModel({ ...productData, media: img });
      newProduct.productType = {
        _id: findType._id,
        typeName: findType.typeName,
      };
      await newProduct.save();

      // Thêm sản phẩm vào mảng sản phẩm của loại sản phẩm
      findType.products.push(newProduct);
      await findType.save();

      res.status(200).json({ message: createMessage.SUCCESS });
    } catch (err) {
      const { files } = req;
      if (files && files.length > 0) {
        const fileNameList = files.map((ele) => ele.filename);

        await deleteImagesCloudinary(fileNameList);
      }
      res.status(500).json(err);
    }
  };

  /** update product */
  static updateProduct = async (req, res) => {
    try {
      const { productType, ...updatedProductData } = req.body;
      const { id } = req.params;
      const { files } = req;

      const existingProduct = await ProductModel.findById(id);

      if (!existingProduct) {
        const fileNameList = files.map((ele) => ele.filename);

        await deleteImagesCloudinary(fileNameList);
        return res.status(404).json({ message: statusMessage.NOT_FOUND });
      }

      // Lấy thông tin về hình ảnh cũ
      const oldMedia = existingProduct.media.filter((ele) => {
        if (ele.fileName) {
          return ele.fileName;
        }
      });

      /** delete images if exist images */
      if (files && files.length > 0) {
        await deleteImagesCloudinary(
          oldMedia.map((media) => media.fileName)
        );

        // Lưu hình ảnh mới và cập nhật media
        const newMedia = [];
        for (let i = 0; i < files.length; i++) {
          const newMediaObject = {
            fileName: files[i].filename,
            src: files[i].path,
          };
          newMedia.push(newMediaObject);
        }

        updatedProductData.media = newMedia;
      }

      // Tìm và cập nhật sản phẩm
      const updatedProduct = await ProductModel.findOneAndUpdate(
        { _id: existingProduct._id },
        { $set: updatedProductData },
        { new: true } // Trả về sản phẩm sau khi đã cập nhật
      );

      if (!updatedProduct)
        return res.status(404).json({ message: updateMessage.FAILD });

      if (productType) {
        // Tìm loại sản phẩm mới
        const newProductType = await ProductTypeModel.findById(productType);
        if (!newProductType)
          return res.status(404).json({ message: statusMessage.NOT_FOUND });

        // Xoá sản phẩm khỏi loại sản phẩm cũ (nếu có)
        if (updatedProduct.productType) {
          const oldProductType = await ProductTypeModel.findById(
            updatedProduct.productType
          );
          if (oldProductType) {
            const indexOfProduct = oldProductType.products.indexOf(id);
            if (indexOfProduct !== -1) {
              oldProductType.products.splice(indexOfProduct, 1);
              await oldProductType.save();
            }
          }
        }

        // Cập nhật loại sản phẩm cho sản phẩm
        updatedProduct.productType = productType;

        // Thêm sản phẩm vào loại sản phẩm mới
        newProductType.products.push(updatedProduct);
        await newProductType.save();
      }

      res.status(200).json({ message: updateMessage.SUCCESS });
    } catch (err) {
      const { files } = req;
      if (files && files.length > 0) {
        const fileNameList = files.map((ele) => ele.filename);

        await deleteImagesCloudinary(fileNameList);
      }
      res.status(500).json(err);
    }
  };

  /** delete product */
  static deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;

      // Lấy thông tin sản phẩm trước khi xóa
      const product = await ProductModel.findById(id);

      if (!product) {
        return res.status(404).json({ message: statusMessage.NOT_FOUND });
      }

      /** delete images */
      const mediaList = product.media.filter(ele => {
        if(ele.fileName) {
          return ele.fileName
        }
      })

      if(mediaList.length > 0) {
        await deleteImagesCloudinary(mediaList.map(ele => ele.fileName));
      }
      // Lấy id của ProductType từ sản phẩm
      const productTypeId = product.productType;

      // Xóa tham chiếu đến sản phẩm từ ProductType
      await ProductTypeModel.findByIdAndUpdate(productTypeId, {
        $pull: { products: id }, // Loại bỏ sản phẩm từ mảng products
      });

      // Cuối cùng, xóa sản phẩm
      await ProductModel.findByIdAndDelete(id);

      res.status(200).json({ message: deleteMessage.SUCCESS });
    } catch (err) {
      res.status(500).json(err);
    }
  };
}

module.exports = {
  ProductController,
  ProductTypeController,
};
