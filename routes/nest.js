import { Router } from 'express'
import * as nestCtrl from "../controllers/nest.js"
export {
  router
}

const router = Router()

router.get("/", isLoggedIn, nestCtrl.index) // done
router.get("/allProfiles", isLoggedIn, nestCtrl.indexProfiles) // done
router.get("/allPosts", isLoggedIn, nestCtrl.indexPosts) 
router.get("/:id", isLoggedIn, nestCtrl.showProfile) // done
router.put("/:id", isLoggedIn, nestCtrl.updateProfile) // done
router.delete("/:id", isLoggedIn, nestCtrl.deleteProfile)
router.post("/flocks", isLoggedIn, nestCtrl.newFlock) // done
router.post("/posts", isLoggedIn, nestCtrl.newPost) // done
router.get("/posts/:id", isLoggedIn, nestCtrl.showPost)
router.put("/posts/:id", isLoggedIn, nestCtrl.updatePost) //done
router.delete("/posts/:id", isLoggedIn, nestCtrl.deletePost) //done
router.post("/posts/:id/like", isLoggedIn, nestCtrl.likePost) // done


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/google");
}