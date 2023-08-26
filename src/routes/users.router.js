import { Router } from 'express';
import { deleteUser , changeRol, insertFile } from "../controllers/user.controller.js"
import { uploader } from '../utils/utils.js';

const router = Router();

router.route('/delete/:uid')
    .delete(deleteUser);

router.route('/premium/:uid')
    .post(changeRol);

router.route('/:uid/documents')
    .post(uploader.single('file'), insertFile);

export default router;