import mongoose from 'mongoose'

export {
  DateMessage
}

const dateMessageSchema = new mongoose.Schema(
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


const DateMessage = mongoose.model('Date Message', dateMessageSchema)