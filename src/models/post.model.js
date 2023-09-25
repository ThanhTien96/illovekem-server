
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    subContent: {
        type: String,
        required: false
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

}, {collection: "Post", timestamps:  true});

const PostModel = mongoose.model('Post', schema);

module.exports = PostModel;
