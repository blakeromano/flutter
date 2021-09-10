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
    like,
    filter,
}

function editProfile(req, res) {
    Profile.findById(req.params.id)
    .then(profile => {
      res.render('dates/edit', {
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
    .then(profiles => {
        Profile.findById(req.user.profile._id)
        .then(profile => {
            if(profile.interestedIn === "" || profile.country === "" || profile.state === "" || profile.city === "") {
                res.redirect(`/date/${profile._id}/schmedit`)
            } else {
                res.render("dates/index", {
                    title: "Dates Home",
                    profiles,
                    profile,
                })
            }
        })
    })
}
function showProfile(req, res) {
    Profile.findById(req.params.id)
    .populate("likedUsers")
    .populate("likedBy")
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

// function deleteProfile (req, res) {
    //  User.findByIdAndDelete(req.user._id)
    // .then(user => {
    //     Profile.findByIdAndDelete(req.user.profile._id)
    //     .then(profile => {
    //         Post.deleteMany({author: profile._id})
    //         .then(() => {

    //         })
    //         res.redirect("/")
    //     })
    // })
    // .catch(err => {
    //     console.log(err)
    //     res.redirect("/choose")
    // })
// }

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
    console.log('test')
    DateMessage.find({$or: [
        {$and: [{to: req.user.profile._id}, {from: req.params.id}]},
        {$and: [{to: req.params.id}, {from: req.user.profile._id}]}
    ]})
    .populate("to")
    .populate("from")
    .then(messages => {
        console.log(messages)
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

function like(req, res) {
    Profile.findById(req.user.profile._id)
    .then(userProfile => {
        const userProfileLiked = []
        userProfile.likedUsers.forEach(liked => {
            userProfileLiked.push(liked.toString())
        })
        if(!userProfileLiked.includes(req.params.id)) {
            console.log("not liking")
            Profile.findById(req.params.id)
            .then(profileLiked => {
                profileLiked.likedBy.push(req.user.profile._id)
                profileLiked.save()
                .then(() => {
                    userProfile.likedUsers.push(req.params.id)
                    userProfile.save()
                    .then(() => {
                        res.redirect(req.headers.referer)
                    })
                })
            })
        } else {
            console.log('liking')
            Profile.findById(req.params.id)
            .then(profileLiked => {
                profileLiked.likedBy.remove(req.user.profile._id)
                profileLiked.save()
                .then(() => {
                    userProfile.likedUsers.remove(req.params.id)
                    userProfile.save()
                    .then(() => {
                        res.redirect(req.headers.referer)
                    })
                })
            })
        }
    })
}

// function filter (req, res) {
//     let filteredProfiles = []
//     // req.body.minAgeInt = minAgeInt.parseInt()
//     // req.body.maxAgeInt = maxAgeInt.parseInt()
//     for (let key in req.body) {
//         if (req.body[key] === '') delete req.body[key]
//     }
//     console.log(req.body)
//     Profile.find({
//         age: {$gt: req.body.minAgeInt ? req.body.minAgeInt : 18, $lt: req.body.maxAgeInt ? req.body.maxAgeInt : 99 },
//         country: req.body.country,
//         state: req.body.state,
//         city: req.body.city,
//         gender: req.body.gender
//     })
//     .then(profiles => {
//         // if (req.body.minAgeInt) {
//         //     filteredProfiles = profiles.filter(profile => profile.age > req.body.minAgeInt)
//         // }
//         // if (req.body.maxAgeInt) {
//         //     filteredProfiles = profiles.filter(profile => profile.age < req.body.maxAgeInt)
//         // }
//         // if (req.body.country) {
//         //     filteredProfiles = profiles.filter(profile => profile.country === req.body.country)
//         // }
//         // if (req.body.state) {
//         //     filteredProfiles = profiles.filter(profile => profile.state === req.body.state)
//         // }
//         // if (req.body.city) {
//         //     filteredProfiles = profiles.filter(profile => profile.city === req.body.city)
//         // }
//         // if (req.body.gender) {
//         //     filteredProfiles = profiles.filter(profile => profile.gender === req.body.gender)
//         // }
//         res.render("dates/index", {
//             title: "Dates Home",
//             profiles: profiles,
//         })
//     })
// }

function filter (req, res) {
    let filteredProfiles  = []

    for (let key in req.body) {
        if (req.body[key] === '') delete req.body[key]
    }
    console.log(req.body)
    Profile.find({
        age: {$gt: req.body.minAgeInt, $lt: req.body.maxAgeInt},
    })
    .then(ageMatches => {
        filteredProfiles.push(ageMatches)
        console.log('0', filteredProfiles)
        Profile.find({country: req.body.country})
        .then(countryMatches => {
            countryMatches.forEach(match => {
                if (!filteredProfiles.includes(profile => profile._id === match._id)) {
                    filteredProfiles.push(match)
                }
            })
            console.log('1', filteredProfiles)
            Profile.find({state: req.body.state})
            .then(stateMatches => {
                stateMatches.forEach(match => {
                    if (!filteredProfiles.includes(profile => profile._id === match._id)) {
                        filteredProfiles.push(match)
                    }
                })
                console.log('2',filteredProfiles)
                Profile.find({city: req.body.city})
                .then(cityMatches => {
                    cityMatches.forEach(match => {
                        if (!filteredProfiles.includes(profile => profile._id === match._id)) {
                            filteredProfiles.push(match)
                        }
                    })
                    console.log('3',filteredProfiles)
                    Profile.find({gender: req.body.gender})
                    .then(genderMatches => {
                        genderMatches.forEach(match => {
                            if (!filteredProfiles.includes(profile => profile._id === match._id)) {
                                filteredProfiles.push(match)
                            }
                        })
                        console.log('final',filteredProfiles)
                        res.render("dates/index", {
                            title: "Dates Home",
                            profiles: filteredProfiles.flat(),
                        })
                    })
                })
            })
        })
    })
}