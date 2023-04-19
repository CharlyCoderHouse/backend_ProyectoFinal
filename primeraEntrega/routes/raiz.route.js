import { Router } from "express";
//INICIALIZO ROUTER
const router = Router();

router.route('/')
    .get((req, res) => {
    res.send(`<h1 style="color:darkblue;">Bienvenidos al servidor express</h1> <br>
    <h2 style="color:darkblue;">Primer Pre-Entrega</h2>`)
});

export default router;