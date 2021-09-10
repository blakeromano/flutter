import { Router } from 'express'
import * as dateCtrl from "../controllers/date.js"
export {
  router
}

const router = Router()

router.get("/", isLoggedIn, dateCtrl.index)
router.get("/messageIndex", isLoggedIn, dateCtrl.messageIndex) 
router.get("/:id", isLoggedIn, dateCtrl.showProfile)
router.get("/messages/:id", isLoggedIn, dateCtrl.messageShow)
router.get("/:id/edit", isLoggedIn, dateCtrl.editProfile)
router.post("/filter", isLoggedIn, dateCtrl.filter)
router.post("/messages/:id", isLoggedIn, dateCtrl.messageNew) 
router.put("/:id", isLoggedIn, dateCtrl.updateProfile)
router.post("/:id/like", isLoggedIn, dateCtrl.like)



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/google");
}