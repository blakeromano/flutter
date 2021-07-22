import { Router } from 'express'
import * as dateCtrl from "../controllers/date.js"
export {
  router
}

const router = Router()

router.get("/", isLoggedIn, dateCtrl.index)
router.get("/:id", isLoggedIn, dateCtrl.show)
router.put("/:id", isLoggedIn, dateCtrl.update)
router.delete("/:id", isLoggedIn, dateCtrl.delete)
router.post("/posts", isLoggedIn, dateCtrl.newPost)
router.get("/posts", isLoggedIn, dateCtrl.indexPosts)
router.get("/posts/:id", isLoggedIn, dateCtrl.showPost)
router.put("/posts/:id", isLoggedIn, dateCtrl.updatePost)
router.delete("/posts/:id", isLoggedIn, dateCtrl.deletePost)


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/google");
}