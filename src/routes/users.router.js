import { Router } from 'express';
import { deleteUser , changeRol, insertFile } from "../controllers/user.controller.js"
import { uploader } from '../utils/utils.js';

const router = Router();

router.route('/delete/:uid')
    .delete(deleteUser);

router.route('/premium/:uid')
    .post(changeRol);

router.route('/:uid/documents')
    .post(uploader.fields([{name: 'profiles', maxCount: 1}, 
        {name: 'products', maxCount: 1},
        {name: 'documents', maxCount: 3}]), insertFile);

export default router;