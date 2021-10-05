import express, { Request, Response } from 'express';
import * as bangumiController from '../../controllers/bangumi.controller';
import githubWebhook from '../../middlewares/githubWebhook.middleware';

const router = express.Router();

router.post('/update', githubWebhook, async (req: Request, res: Response) => {
  await bangumiController.update(req, res);
});

export default router;
