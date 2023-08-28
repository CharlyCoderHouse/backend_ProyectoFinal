import { Router } from 'express';
import { deleteUser , changeRol, insertFile } from "../controllers/user.controller.js"
import { uploader, userComplete } from '../utils/utils.js';

const router = Router();

router.route('/delete/:uid')
    .delete(deleteUser);

router.route('/premium/:uid')
    .post(userComplete,changeRol);

router.route('/:uid/documents')
    .post(uploader, insertFile);

export default router;