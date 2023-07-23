import { Router } from 'express';

const router = Router();

router.route('/')
    .get((req, res) => {
        //default levels
        req.logger.fatal('Prueba fatal');
        req.logger.error('Prueba error');
        req.logger.warning('Prueba warning');
        req.logger.info('Prueba info');
        req.logger.http('Prueba http');
        req.logger.debug('Prueba debug');
});

export default router;