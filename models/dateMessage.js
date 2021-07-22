import mongoose from 'mongoose'

export {
  DateMessage
}

const dateMessageSchema = new mongoose.Schema(
  {

  },
  {
    timestamps: true,
  }
)

const DateMessage = mongoose.model('DateMessage', dateMessageSchema)