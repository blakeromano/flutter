import mongoose from 'mongoose'

export {
  Question
}


const questionSchema = new mongoose.Schema(
  {
    content: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Question = mongoose.model('Question', questionSchema)