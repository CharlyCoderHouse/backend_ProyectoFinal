import { Router } from "express";
import { passportCall } from "../utils.js";
//INICIALIZO ROUTER
const router = Router();

// RENDERIZO HBS
router.route('/')
    .get(passportCall('jwt'), (req, res) => {
        res.render('home.hbs', {
            user: req.user
        });
    });

export default router;