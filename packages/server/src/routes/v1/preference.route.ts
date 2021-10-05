import express, { Request, Response } from 'express';
import * as userPreferenceController from '../../controllers/userPreference.controller';
import * as bangumiPreferenceController from '../../controllers/bangumiPreference.controller';
import auth from '../../middlewares/auth.middleware';
import {
  commonPreferenceValidationRules,
  updateBangumiPreferenceValidationRules,
  validate,
} from '../../middlewares/validator.middleware';

const router = express.Router();

router.get('/common', auth, async (req: Request, res: Response) => {
  await userPreferenceController.getCommon(req, res);
});

router.patch(
  '/common',
  auth,
  commonPreferenceValidationRules(),
  validate,
  async (req: Request, res: Response) => {
    await userPreferenceController.updateCommon(req, res);
  }
);

router.get('/bangumi', auth, validate, async (req: Request, res: Response) => {
  await bangumiPreferenceController.get(req, res);
});

router.patch(
  '/bangumi',
  auth,
  updateBangumiPreferenceValidationRules(),
  validate,
  async (req: Request, res: Response) => {
    await bangumiPreferenceController.update(req, res);
  }
);

export default router;
