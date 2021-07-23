import { Router } from 'express'
import * as nestCtrl from "../controllers/nest.js"
export {
  router
}

const router = Router()

router.get("/", isLoggedIn, nestCtrl.index)
router.get("/:id", isLoggedIn, nestCtrl.showProfile)
router.put("/:id", isLoggedIn, nestCtrl.updateProfile)
router.delete("/:id", isLoggedIn, nestCtrl.deleteProfile)
router.post("/flocks", isLoggedIn, nestCtrl.newFlock)
router.post("/posts", isLoggedIn, nestCtrl.newPost)
router.get("/posts", isLoggedIn, nestCtrl.indexPosts)
router.get("/posts/:id", isLoggedIn, nestCtrl.showPost)
router.put("/posts/:id", isLoggedIn, nestCtrl.updatePost)
router.delete("/posts/:id", isLoggedIn, nestCtrl.deletePost)
router.post("/posts/:id/like", isLoggedIn, nestCtrl.likePost)


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/google");
}