import { Router } from 'express'

export {
  router
}

const router = Router()
router.get('/', isLoggedIn, (req, res) => {
    res.render("choose", {
        title: "Choose Your Fate",
        
    })
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/google");
  }