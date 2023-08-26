import { Router } from 'express';
import { deleteUser , changeRol } from "../controllers/user.controller.js"

const router = Router();

router.route('/delete/:uid')
    .delete(deleteUser);

router.route('/premium/:uid')
    .post(changeRol);

router.route('/:uid/documents')
    .post(changeRol);

export default router;