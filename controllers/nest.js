import { Profile } from "../models/profile.js"
import { Post } from "../models/post.js"
import { Flock } from "../models/flock.js"
import { NestMessage } from "../models/nestMessage.js"
import { User } from "../models/user.js"

export {
    index,
    showProfile as show,
    update,
    deleteProfile as delete,
    newPost,
    indexPosts,
    updatePost,
    deletePost,
    showPost,
    newFlock,
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
            .then(posts => {
                console.log(flocks)
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
    .populate("flocks")
    .then(profile => {
        Post.find({author: profile._id})
        .sort({_id: -1})
        .limit(6)
        .then(posts => {
            res.render("nest/show", {
                title: `${profile.name}'s Profile`,
                profile,
                posts,
            })
        })
    })
    .catch(err => {
        console.log(err)
        res.redirect("/choose")
    })
}
function update (req, res) {
    Profile.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(profile => {
        res.redirect(`/nest/${profile._id}`)
    })
}
function deleteProfile (req, res) {
    User.findByIdAndDelete(req.user._id)
    .then(user => {
        Profile.findByIdAndDelete(req.user.profile._id)
        .then(profile => {
            res.redirect("/")
        })
    })
    .catch(err => {
        console.log(err)
        res.redirect("/choose")
    })
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
    Posts.find({})
    .then(posts => {
        Profile.findById(req.user.profile._id)
        .then(profile => {
            res.render("nest/indexPosts", {
                title: "All Posts",
                posts,
                profile,
            })
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
    Post.findByIdAndDelete(req.params.id)
    .then(post => {
        res.redirect("/nest")
    })
}
function showPost (req, res) {
    Post.findById(req.params.id)
    .then(post => {
        Profile.findById(post.author)
        .then(profile => {
            res.render("/nest/show", {
                title: `${profile.name}'s Post`,
                post,
                profile,
            })
        })
    })
}
function newFlock (req, res) {
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
}