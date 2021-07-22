import mongoose from 'mongoose'

export {
  NestMessage
}

const nestMessageSchema = new mongoose.Schema(
  {
    from: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
    to: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
    content: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true,
  }
)

const NestMessage = mongoose.model('Nest Message', nestMessageSchema)