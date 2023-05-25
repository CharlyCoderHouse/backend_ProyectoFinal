import { Router } from "express";
//INICIALIZO ROUTER
const router = Router();

// RENDERIZO HBS
router.route('/')
    .get((req, res) => {
        res.render("home.hbs");
});

export default router;