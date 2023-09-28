const { BannerModel, ShopSystemModel } = require("../models/otherFeature.model");
const PostModel = require("../models/post.model");
const { ProductModel } = require("../models/product.model");
const { UserModel } = require("../models/user.model");

class CountDocument {
    static countAllDocument = async (req, res) => {
        try {
            const totalproduct = await ProductModel.countDocuments();
            const totalProductPublic = await ProductModel.countDocuments({isPublic: true});
            const totalPost = await PostModel.countDocuments();
            const totalPostPublic = await PostModel.countDocuments({isPublic: true});
            const totalBanner = await BannerModel.countDocuments();
            const totalShopSystem = await ShopSystemModel.countDocuments();
            const totalAccount = await UserModel.countDocuments();

            res.status(200).json({
                totalproduct,
                totalProductPublic,
                totalPostPublic,
                totalPost,
                totalBanner,
                totalShopSystem,
                totalAccount
            })
        } catch (err) {
            res.status(500).json(err);
        }
    }
}


module.exports = {
    CountDocument,
}