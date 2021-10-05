import { Request, Response, NextFunction } from 'express';
import {
  body,
  query,
  param,
  validationResult,
  checkSchema,
  ValidationChain,
} from 'express-validator';
import { SiteType, BangumiDomain } from 'bangumi-list-v3-shared';

const SEASON_REGEXP = /^\d{4}q[1234]$/;

export const signupUserValidationRules = (): ValidationChain[] => [
  body('email').isEmail(),
  body('password').isLength({ min: 6, max: 72 }).isAscii(),
];

export const loginUserValidationRules = (): ValidationChain[] => [
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 72 }).isAscii(),
];

export const updateUserValidationRules = (): ValidationChain[] => [
  body('oldPassword').isLength({ min: 6, max: 72 }).isAscii(),
  body('newPassword').isLength({ min: 6, max: 72 }).isAscii(),
];

export const bangumiSeasonValidationRules = (): ValidationChain[] => [
  query('start').optional().matches(SEASON_REGEXP),
];

export const bangumiSiteValidationRules = (): ValidationChain[] => [
  query('type').optional().isIn(Object.values(SiteType)),
];

export const bangumiArchiveValidationRules = (): ValidationChain[] => [
  param('season').matches(SEASON_REGEXP),
];

export const commonPreferenceValidationRules = (): ValidationChain[] =>
  checkSchema({
    newOnly: {
      optional: true,
      isBoolean: true,
    },
    bangumiDomain: {
      optional: true,
      isIn: {
        options: [Object.values(BangumiDomain)],
      },
    },
  });

export const updateBangumiPreferenceValidationRules = (): ValidationChain[] =>
  checkSchema({
    watching: {
      optional: true,
      isArray: true,
    },
  });

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
    return;
  }
  const extractedErrors: { [key: string]: string }[] = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  res.status(422).json({
    errors: extractedErrors,
  });
};
