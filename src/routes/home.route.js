import { Router } from "express";
import { passportCall } from "../utils.js";
import { iniHome } from "../controllers/home.controller.js";

//INICIALIZO ROUTER
const router = Router();

// RENDERIZO HBS
router.route('/')
    .get(passportCall('jwt'), iniHome);

export default router;