import { Router } from 'express'
import * as dateCtrl from "../controllers/date.js"
export {
  router
}

const router = Router()

router.get("/", isLoggedIn, dateCtrl.index)
router.get("/messageIndex", isLoggedIn, dateCtrl.messageIndex) 
router.get("/:id", isLoggedIn, dateCtrl.showProfile)
router.get("/messageNew/:id", isLoggedIn, dateCtrl.messageNew)
router.get("/:id/schmedit", isLoggedIn, dateCtrl.editProfile)
router.post("/messageShow/:id", isLoggedIn, dateCtrl.messageShow) 
router.put("/:id", isLoggedIn, dateCtrl.updateProfile)
router.delete("/:id", isLoggedIn, dateCtrl.delete)



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/google");
}