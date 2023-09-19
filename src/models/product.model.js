const mongoose = require('mongoose');


const productTypeSchema = new mongoose.Schema({
    typeName: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: Number,
        requried: true,
        unique: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
}, {collection: "ProductType", timestamps: true})

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    media: [
        {
            fileName: {
                type: String
            },
            src: {
                type: String,
            }
        }
    ],
    originalPrice: {
        type: Number,
        requried: true
    },
    overwritePrice: {
        type: Number,
        required: false
    },
    sortDescription: {
        type: String,
        required: false
    },
    rate: {
        type: Number,
        min: 0,
        max: 5,
        required: false
    },
    productType: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "ProductType"
    }
},{collection: "Product", timestamps: true});

const ProductTypeModel = mongoose.model('ProductType', productTypeSchema);
const ProductModel = mongoose.model("Product", productSchema);


module.exports = {
    ProductTypeModel,
    ProductModel
}

