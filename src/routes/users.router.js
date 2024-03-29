import { Router } from 'express';
import { deleteUser , changeRol, insertFile, getUsersAll, deleteAllUser } from "../controllers/user.controller.js"
import { authorization, passportCall, uploader, userComplete } from '../utils/utils.js';

const router = Router();

router.route('/usersadmin')
    .get(passportCall('jwt'), authorization(['Admin']), getUsersAll);

router.route('/delete')
    .delete(deleteAllUser);

router.route('/delete/:uid')
    .delete(deleteUser);

router.route('/premium/:uid')
    .post(userComplete,changeRol);

router.route('/:uid/documents')
    .post(passportCall('jwt'), uploader, insertFile);

export default router;