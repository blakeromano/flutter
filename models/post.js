import mongoose from 'mongoose'

export {
  Post
}

const commentSchema = new mongoose.Schema({
    content: String,
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    }
})

const postSchema = new mongoose.Schema(
  {
    content: {
        type: String,
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    }],
    comments: [commentSchema],
    image: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
  },
  {
    timestamps: true,
  }
)

const Post = mongoose.model('Post', postSchema)