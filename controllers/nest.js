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
                res.render("nest/index", {
                    title: "Nest Home",
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
    req.body.author = req.user.profile._id
    Post.create(req.body)
    .then(post => {
        Profile.findById(req.user.profile._id)
        .then(profile => {
            profile.posts.push(post._id)
            profile.save()
            .then(() => {
                res.redirect("/nest")
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
        res.redirect(`/nest/${post._id}`)
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
                res.redirect("/nest")
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
                        res.redirect(`/nest/flocks/${flock._id}`)
                    })
                })
            })
        } else if (flock.profiles[0]._id.toString() == req.user.profile._id.toString()) {
            res.redirect(`/nest/flocks/${flock._id}`)
        } else {
            flock.profiles.remove(req.user.profile._id)
            flock.memberCount = flock.memberCount - 1
            flock.save()
            .then(() => {
                Profile.findById(req.user.profile._id)
                .then(profile => {
                    profile.flocks.push(flock._id)
                    profile.save()
                    .then(() => {
                        res.redirect("/nest")
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
                    res.redirect("/nest")
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
            res.redirect("/nest")
        })
        } else {
            post.likes.remove(req.user.profile._id)
            post.save()
            .then(() => {
                res.redirect("/nest")
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
    Flock.findByIdandUpdate(req.params.id)
    .then(() => {
        res.redirect(`/nest/flocks/${req.params.id}`)
    })
}