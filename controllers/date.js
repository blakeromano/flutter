import { Profile } from "../models/profile.js"
import { Post } from "../models/post.js"
import { Flock } from "../models/flock.js"
import { DateMessage } from "../models/dateMessage.js"
import { User } from "../models/user.js"
 
 
export {
    index,
    showProfile,
    updateProfile,
    editProfile,
    messageIndex,
    messageNew,
    messageShow,
    likeProfile,
    questions,
    deleteProfile
    
}
function questions(req, res) {
    Profile.findById(req.params.id)
    .then(profile => {
      res.render('dates/questions', {
        title: `Prompts for ${profile.name}'s profile`,
        profile
      })
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    }) 
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
        console.log("This is messages ", messages)
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
function likeProfile (req, res) {
    Profile.findById(req.user.profile._id)
    .then(profileLiked => {
        const profileLikedLike = []
        profileLiked.liked.forEach(liker => {
            profileLikedLike.push(liker.toString())
        })
        console.log(!profileLikedLike.includes(req.params.id))
        if(!profileLikedLike.includes(req.params.id)) {
            Profile.findById(req.params.id)
            .then(profileLiked => {
                profileLiked.likers.push(req.user.profile._id)
                profileLiked.save()
                .then(() => {
                    profileLiked.liked.push(req.params.id)
                    profileLiked.save()
                    .then(() => {
                        res.redirect(req.headers.referer)
                    })
                })
            })
        } else {
            Profile.findById(req.params.id)
            .then(profileLiked => {
                profileLiked.liked.remove(req.params.id)
                profileLiked.save()
                .then(() => {
                    profileLiked.likers.remove(req.user.profile._id)
                    profileLiked.save()
                    .then(() => {
                        res.redirect(req.headers.referer)
                    })
                })
            })
        }
    })
}
function deleteProfile (req, res) {
    Profile.findByIdAndDelete(req.params.id)
    .then((user) => {
        console.log('this is the user profile ', user)
        User.findOneAndDelete({ profile: user._id })
        .then((profile) => {
            console.log('this is the profile ', profile)
            res.redirect('/date')
        })
    })
}