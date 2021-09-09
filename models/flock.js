import mongoose from 'mongoose'

export {
  Flock
}

const flockSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
    },
    profiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    memberCount: {
      type: Number,
      default: 1
    },
    desc: String,
  },
  {
    timestamps: true,
  }
)

const Flock = mongoose.model('Flock', flockSchema)