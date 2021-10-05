import express, { Request, Response } from 'express';
import * as bangumiController from '../../controllers/bangumi.controller';
import auth from '../../middlewares/auth.middleware';
import authAdmin from '../../middlewares/authAdmin.moddleware';
import {
  bangumiSeasonValidationRules,
  bangumiArchiveValidationRules,
  bangumiSiteValidationRules,
  validate,
} from '../../middlewares/validator.middleware';

const router = express.Router();

router.post('/update', auth, authAdmin, async (req: Request, res: Response) => {
  await bangumiController.update(req, res);
});

router.get(
  '/season',
  bangumiSeasonValidationRules(),
  validate,
  async (req: Request, res: Response) => {
    await bangumiController.season(req, res);
  }
);

router.get(
  '/archive/:season',
  bangumiArchiveValidationRules(),
  validate,
  async (req: Request, res: Response) => {
    await bangumiController.getArchive(req, res);
  }
);

router.get('/onair', async (req: Request, res: Response) => {
  await bangumiController.getOnAir(req, res);
});

router.get(
  '/site',
  bangumiSiteValidationRules(),
  validate,
  async (req: Request, res: Response) => {
    await bangumiController.site(req, res);
  }
);

export default router;
