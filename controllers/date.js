import { Profile } from "../models/profile.js"
import { Post } from "../models/post.js"
import { Flock } from "../models/flock.js"
import { DateMessage } from "../models/dateMessage.js"
import { User } from "../models/user.js"
 
 
export {
    index,
    showProfile,
    updateProfile,
    deleteProfile as delete,
    editProfile,
    messageIndex,
    messageNew,
    messageShow,
    
}
 
function editProfile(req, res) {
    Profile.findById(req.params.id)
    .then(profile => {
      res.render('dates/schmedit', {
        title: `Editing ${profile.name}'s profile`,
        profile
      })
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    }) 
}

function index(req, res) {
    Profile.find({})
    .sort({_id: -1})
    .limit(5)
    .then(profiles => {
        Flock.find({})
        .sort({_id: -1})
        .limit(3)
        .populate("profiles")
        .then(flocks => {
            Post.find({})
            .sort({_id: -1})
            .limit(10)
            .populate("author")
            .populate("likes")
            .then(posts => {
                res.render("dates/index", {
                    title: "Dates Home",
                    flocks,
                    posts,
                    profiles,
                })
            })
        })
    })
    .catch(err => {
        console.log(err)
        res.redirect("/choose")
    })
}
function showProfile(req, res) {
    Profile.findById(req.params.id)
    .then(profile => {
        res.render("dates/profileShow", {
            title: `${profile.name}'s Profile`,
            profile,
        })
    })
    .catch(err => {
        console.log(err)
        res.redirect("/choose")
    })
}
function updateProfile(req, res) {
    Profile.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(profile => {
        console.log('This is profile:', profile)
      res.redirect(`/date/${profile._id}`)
    })
}

function deleteProfile (req, res) {
     User.findByIdAndDelete(req.user._id)
    .then(user => {
        Profile.findByIdAndDelete(req.user.profile._id)
        .then(profile => {
            Post.deleteMany({author: profile._id})
            .then(() => {

            })
            res.redirect("/")
        })
    })
    .catch(err => {
        console.log(err)
        res.redirect("/choose")
    })
}

function messageNew (req, res) {
    req.body.from = req.user.profile._id
    Profile.findById(req.user.profile._id)
    .then(fromProfile => {
        Profile.findById(req.body.to)
        .then(toProfile => {
            DateMessage.create(req.body)
            .then(message => {
                if(fromProfile.dateMessaged.includes(toProfile._id)) {
                    toProfile.dateMessages.push(message._id)
                    toProfile.save()
                    .then(() => {
                        fromProfile.dateMessages.push(message._id)
                        fromProfile.save()
                        .then(() => {
                            res.redirect(req.headers.referer)
                        })
                    })
                } else {
                    toProfile.dateMessages.push(message._id)
                    toProfile.dateMessaged.push(fromProfile._id)
                    toProfile.save()
                    .then(() => {
                        fromProfile.dateMessages.push(message._id)
                        fromProfile.dateMessaged.push(toProfile._id)
                        fromProfile.save()
                        .then(() => {
                            res.redirect(req.headers.referer)
                        })
                    })
                }
            })
        })
    })
}

function messageShow (req,res) {
    DateMessage.find({$or: [
        {$and: [{to: req.user.profile._id}, {from: req.params.id}]},
        {$and: [{to: req.params.id}, {from: req.user.profile._id}]}
    ]})
    .populate("to")
    .populate("from")
    .then(messages => {
        Profile.findById(req.user.profile._id)
        .then(usersProfile => {
            Profile.findById(req.params.id)
            .then(otherProfile => {
                res.render("dates/messageShow", {
                    title: "Messages",
                    messages: messages,
                    otherProfile,
                    usersProfile,
                })
            })
        })
    })
}
function messageIndex (req, res) {
    Profile.findById(req.user.profile._id)
    .populate("dateMessaged")
    .then(profile => {
        Profile.find({})
        .then(profiles => {
            res.render("dates/messageIndex", {
                title: `${profile.name}'s Messages`,
                profile: profile,
                profiles: profiles,
            })
        })
    })
}