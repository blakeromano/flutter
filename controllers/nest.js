import { Profile } from "../models/profile.js"
import { Post } from "../models/post.js"
import { Flock } from "../models/flock.js"
import { NestMessage } from "../models/nestMessage.js"
import { User } from "../models/user.js"

export {
    index,
    showProfile,
    updateProfile,
    deleteProfile,
    newPost,
    indexPosts,
    updatePost,
    deletePost,
    joinFlock,
    newFlock,
    likePost,
    indexProfiles,
    showFlock,
    editFlock,
    followProfile,
    messagesIndex,
    messagesNew,
    messagesShow,
    newComment,
    deleteComment,
}

function index (req, res) {
    Profile.find({})
    .sort({_id: -1})
    .limit(5)
    .then(profiles => {
        Flock.find({})
        .sort({_id: -1})
        .limit(3)
        .populate("profiles")
        .then(flocks => {
            Profile.findById(req.user.profile._id)
            .then(profile => {
                Post.find({$or: [
                    {author: {$in: [profile.following]}},
                    {author: profile._id}
                ]}) 
                .sort({_id: -1})
                .populate({
                    path: "comments.author",
                    model: "Profile"
                })
                .populate("author")
                .populate("likes")
                .then(posts => {
                    res.render("nest/index", {
                        title: "Nest Home",
                        flocks,
                        posts,
                        profiles,
                    })
                })
            })
        })
    })
}
function showProfile(req, res) {
    Profile.findById(req.params.id)
    .populate({
        path: "flocks",
        model: "Flock",
        populate: {
            path: "profiles",
            model: "Profile"
        }
    })
    .populate("posts")
    .populate("following")
    .populate("followers")
    .then(profile => {
        res.render("nest/profileShow", {
            title: `${profile.name}'s Profile`,
            profile,
        })
    })
    .catch(err => {
        console.log(err)
        res.redirect("/choose")
    })
}
function updateProfile (req, res) {
    Profile.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(profile => {
        res.redirect(`/nest/${profile._id}`)
    })
}
function deleteProfile (req, res) {
    // User.findByIdAndDelete(req.user._id)
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
}
function newPost (req, res) {
    console.log(req.headers.referer)
    req.body.author = req.user.profile._id
    Post.create(req.body)
    .then(post => {
        Profile.findById(req.user.profile._id)
        .then(profile => {
            profile.posts.push(post._id)
            profile.save()
            .then(() => {
                res.redirect(req.headers.referer)
            })
        })
    })
    .catch(err => {
        console.log(err)
        res.redirect("/choose")
    })
}
function indexPosts (req, res) {
    Post.find()
    .populate("author")
    .then(posts => {
        res.render("nest/allPosts", {
            title: "All Posts",
            posts,
        })
    })
    .catch(err => {
        console.log(err)
        res.redirect("/choose")
    })
}
function updatePost (req, res) {
    Post.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(post => {
        res.redirect(req.headers.referer)
    })
}
function deletePost (req, res) {
    Profile.findById(req.user.profile._id)
    .then(profile => {
        Post.findByIdAndDelete(req.params.id)
        .then(post => {
            profile.posts.remove(req.params.id)
            profile.save()
            .then(() => {
                res.redirect(req.headers.referer)
            })
        })
    })
}
function joinFlock (req, res) {
    Flock.findById(req.params.id)
    .then(flock => {
        if(!flock.profiles.includes(req.user.profile._id)) {
            flock.profiles.push(req.user.profile._id)
            flock.memberCount = flock.memberCount + 1
            flock.save()
            .then(() => {
                Profile.findById(req.user.profile._id)
                .then(profile => {
                    profile.flocks.push(flock._id)
                    profile.save()
                    .then(() => {
                        res.redirect(req.headers.referer)
                    })
                })
            })
        } else if (flock.profiles[0]._id.toString() == req.user.profile._id.toString()) {
            res.redirect(req.headers.referer)
        } else {
            flock.profiles.remove(req.user.profile._id)
            flock.memberCount = flock.memberCount - 1
            flock.save()
            .then(() => {
                Profile.findById(req.user.profile._id)
                .then(profile => {
                    profile.flocks.remove(flock._id)
                    profile.save()
                    .then(() => {
                        res.redirect(req.headers.referer)
                    })
                })
            })
        }
    })
}
function newFlock (req, res) {
    req.body.memberCount = 1
    Flock.create(req.body)
    .then(flock => {
        Profile.findById(req.user.profile._id)
        .then(profile => {
            profile.flocks.push(flock._id)
            profile.save()
            .then(() => {
                flock.profiles.push(profile._id)
                flock.save()
                .then(() => {
                    res.redirect(req.headers.referer)
                })
            })
        })
    })
    .catch(err => {
        console.log(err)
        res.redirect("/choose")
    })
}

function likePost(req, res) {
    Post.findById(req.params.id)
    .then(post => {
        if(!post.likes.includes(req.user.profile._id)){
        post.likes.push(req.user.profile._id)
        post.save()
        .then(() => {
            res.redirect(req.headers.referer)
        })
        } else {
            post.likes.remove(req.user.profile._id)
            post.save()
            .then(() => {
                res.redirect(req.headers.referer)
            })
        }
        
    })
    .catch(err => {
        console.log(err)
        res.redirect("/choose")
    })
}

function indexProfiles(req, res) {
    Profile.find({})
    .then(profiles => {
        res.render("nest/allProfiles", {
            title: "All Profiles",
            profiles,
        })
    })
}
function showFlock (req, res) {
    Flock.findById(req.params.id)
    .populate("profiles")
    .populate("posts")
    .then(flock => {
        res.render("nest/showFlock", {
            title: `${flock.name} Flock`,
            flock,
        })
    })
}
function editFlock (req, res) {
    Flock.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(() => {
        res.redirect(req.headers.referer)
    })
}

function followProfile (req, res) {
    Profile.findById(req.user.profile._id)
    .then(profileFollowing => {
        const profileFollowedFollowing = []
        profileFollowing.following.forEach(follower => {
            profileFollowedFollowing.push(follower.toString())
        })
        console.log(!profileFollowedFollowing.includes(req.params.id))
        if(!profileFollowedFollowing.includes(req.params.id)) {
            Profile.findById(req.params.id)
            .then(profileFollowed => {
                profileFollowed.followers.push(req.user.profile._id)
                profileFollowed.save()
                .then(() => {
                    profileFollowing.following.push(req.params.id)
                    profileFollowing.save()
                    .then(() => {
                        res.redirect(req.headers.referer)
                    })
                })
            })
        } else {
            Profile.findById(req.params.id)
            .then(profileFollowed => {
                profileFollowing.following.remove(req.params.id)
                profileFollowing.save()
                .then(() => {
                    profileFollowed.followers.remove(req.user.profile._id)
                    profileFollowed.save()
                    .then(() => {
                        res.redirect(req.headers.referer)
                    })
                })
            })
        }
    })
}

function messagesNew (req, res) {
    req.body.from = req.user.profile._id
    Profile.findById(req.user.profile._id)
    .then(fromProfile => {
        Profile.findById(req.body.to)
        .then(toProfile => {
            NestMessage.create(req.body)
            .then(message => {
                if(fromProfile.nestMessaged.includes(toProfile._id)) {
                    toProfile.nestMessages.push(message._id)
                    toProfile.save()
                    .then(() => {
                        fromProfile.nestMessages.push(message._id)
                        fromProfile.save()
                        .then(() => {
                            res.redirect(req.headers.referer)
                        })
                    })
                } else {
                    toProfile.nestMessages.push(message._id)
                    toProfile.nestMessaged.push(fromProfile._id)
                    toProfile.save()
                    .then(() => {
                        fromProfile.nestMessages.push(message._id)
                        fromProfile.nestMessaged.push(toProfile._id)
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

function messagesShow (req,res) {
    NestMessage.find({$or: [
        {$and: [{to: req.user.profile._id}, {from: req.params.id}]},
        {$and: [{to: req.params.id}, {from: req.user.profile._id}]}
    ]})
    .populate("to")
    .populate("from")
    .then(messages => {
        const otherProfileId = req.params.id
        res.render("nest/messagesShow", {
            title: "Messages",
            messages: messages,
            otherProfileId: otherProfileId,
        })
    })
}
function messagesIndex (req, res) {
    Profile.findById(req.user.profile._id)
    .populate("nestMessaged")
    .then(profile => {
        Profile.find({})
        .then(profiles => {
            res.render("nest/messagesIndex", {
                title: `${profile.name}'s Messages`,
                profile: profile,
                profiles: profiles,
            })
        })
    })
}

function newComment (req, res) {
    req.body.author = req.user.profile._id
    Post.findById(req.params.id)
    .then(post => {
        post.comments.push(req.body)
        post.save()
        .then(() => {
            res.redirect(req.headers.referer)
        })
    })
}

function deleteComment (req, res) {
    Post.findById(req.params.postId)
    .then(post => {
        post.comments.remove(req.params.commentId)
        post.save()
        .then(() => {
            res.redirect(req.headers.referer)
        })
    })
}