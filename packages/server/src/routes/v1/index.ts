import express from 'express';
import bangumiRoute from './bangumi.route';
import userRoute from './user.route';
import preferenceRoute from './preference.route';
import webhookRoute from './webhook.route';

const router = express.Router();

router.use('/bangumi', bangumiRoute);
router.use('/user', userRoute);
router.use('/preference', preferenceRoute);
router.use('/webhook', webhookRoute);

export default router;
