const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    username: String,
    body: String,
    comments: [
        {
            body: String,
            username: String
        }, {
            timestamps: true
        }
    ],
    likes: [
        {
            username: String
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;