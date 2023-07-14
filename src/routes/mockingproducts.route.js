import { Router } from "express";
import { generateProduct } from '../utils.js';

const router = Router();

router.get('/', (req, res) => {
    let products = [];
    for(let i=0; i< 100; i++) {
        products.push(generateProduct());
    }

    res.send({
        status: 'ok',
        count: products.length,
        data: products
    });
});

export default router;