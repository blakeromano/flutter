import { Router } from 'express'
import * as nestCtrl from "../controllers/nest.js"
export {
  router
}

const router = Router()

router.get("/", isLoggedIn, nestCtrl.index) // done
router.get("/allProfiles", isLoggedIn, nestCtrl.indexProfiles) // done
router.get("/allPosts", isLoggedIn, nestCtrl.indexPosts) // done
router.get("/messages", isLoggedIn, nestCtrl.messagesIndex) // done
router.get("/messages/:id", isLoggedIn, nestCtrl.messagesShow) // 
router.post("/messages/:id", isLoggedIn, nestCtrl.messagesNew) // done
router.put("/flocks/:id", isLoggedIn, nestCtrl.editFlock) //
router.post("/flocks", isLoggedIn, nestCtrl.newFlock) // done
router.get("/flocks/:id", isLoggedIn, nestCtrl.showFlock) // done
router.post("/flocks/:id/join", isLoggedIn, nestCtrl.joinFlock) // done 
router.post("/posts", isLoggedIn, nestCtrl.newPost) // done
router.put("/posts/:id", isLoggedIn, nestCtrl.updatePost) //done
router.delete("/posts/:id", isLoggedIn, nestCtrl.deletePost) //done
router.post("/posts/:id/like", isLoggedIn, nestCtrl.likePost) // done
router.post("/:id/follow", isLoggedIn, nestCtrl.followProfile) // done not tested
router.get("/:id", isLoggedIn, nestCtrl.showProfile) // done
router.put("/:id", isLoggedIn, nestCtrl.updateProfile) // done
router.delete("/:id", isLoggedIn, nestCtrl.deleteProfile)
router.post("/posts/:id/comment", isLoggedIn, nestCtrl.newComment) //


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/google");
}