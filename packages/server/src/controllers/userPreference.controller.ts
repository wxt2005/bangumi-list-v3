import { Request, Response } from 'express';
import userPreferenceModel from '../models/userPreference.model';

export async function getCommon(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }

  const userID = req.user.id;

  let data;
  try {
    data = await userPreferenceModel.getCommon(userID);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
    return;
  }

  res.send(data || userPreferenceModel.getDefaultPreference());
}

export async function updateCommon(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }

  const userID = req.user.id;
  const newData = req.body || {};

  let data;
  try {
    data = await userPreferenceModel.updateCommon(userID, newData);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
    return;
  }

  res.send(data || userPreferenceModel.getDefaultPreference());
}
