import express from 'express';
import twitter from './twitter';

const router = express.Router();
router.use('/twitter', twitter);

export default router;
