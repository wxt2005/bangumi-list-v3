import express, { Request, Response } from 'express';
import * as userController from '../../controllers/user.controller';
import auth from '../../middlewares/auth.middleware';
import {
  signupUserValidationRules,
  loginUserValidationRules,
  updateUserValidationRules,
  validate,
} from '../../middlewares/validator.middleware';

const router = express.Router();

router.get('/me', auth, async (req: Request, res: Response) => {
  await userController.getMe(req, res);
});

router.patch(
  '/me',
  auth,
  updateUserValidationRules(),
  validate,
  async (req: Request, res: Response) => {
    await userController.update(req, res);
  }
);

router.post(
  '/signup',
  signupUserValidationRules(),
  validate,
  async (req: Request, res: Response) => {
    await userController.create(req, res);
  }
);

router.post(
  '/login',
  loginUserValidationRules(),
  validate,
  async (req: Request, res: Response) => {
    await userController.login(req, res);
  }
);

router.post('/logout', auth, async (req: Request, res: Response) => {
  await userController.logout(req, res);
});

export default router;
