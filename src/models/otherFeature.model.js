const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema({
    logo: {
        type: String,
        required: true
    }
},{collection: "Logo"});

const shopSystemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,             
    },
    slug: {
        type: String,
        required: false
    },
    role: {
        type: Number,
        required: true,
        unique: true
    }
}, {collection: "ShopSystem", timestamps: true});

const bannerSchema = new mongoose.Schema({
    src: {
        type: String,
        required: true
    }
}, {collection: "Banner", timestamps: true});

const LogoModel = mongoose.model("Logo", logoSchema);
const ShopSystemModel = mongoose.model("ShopSystem", shopSystemSchema);
const BannerModel = mongoose.model("Banner", bannerSchema);

module.exports = {
    LogoModel,
    ShopSystemModel,
    BannerModel
}