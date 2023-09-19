
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