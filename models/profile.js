import mongoose from 'mongoose'

export {
  Profile
}

const hobbySchema = new mongoose.Schema({
  name: String,

})

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: String,
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"]
  },
  interestedIn: {
    type: String,
    enum: ["Male", "Female", "Other"]
  },
  age: Number,
  country: String,
  state: {
    type: "String",
    enum: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", 'KY', "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WI", "WV", "WY"]
  },
  city: String,
  favBird: String,
  birthday: Date,
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile"
  }],
  hobbies: [hobbySchema],
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile"
  }],
  likedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile"
  }],
  flocks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flock"
  }],
  nestMessages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "NestMessage"
  }],
  dateMessages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "DateMessage"
  }],
  minAgeInt: {
    type: Number,
    min: 18,
    max: 99,
  },
  maxAgeInt: {
    type: Number,
    min: 18,
    max: 99,
  },
}, {
  timestamps: true
})

const Profile = mongoose.model('Profile', profileSchema)