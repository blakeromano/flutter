import { Router } from 'express'
import * as dateCtrl from "../controllers/date.js"
export {
  router
}

const router = Router()

router.get("/", isLoggedIn, dateCtrl.index)
router.get("/:id", isLoggedIn, dateCtrl.showProfile)
router.put("/:id", isLoggedIn, dateCtrl.updateProfile)
router.delete("/:id", isLoggedIn, dateCtrl.delete)
router.get("/:id/schmedit", isLoggedIn, dateCtrl.editProfile)

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/google");
}