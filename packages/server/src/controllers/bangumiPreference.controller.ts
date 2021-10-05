import { Request, Response } from 'express';
import bangumiPreferenceModel from '../models/bangumiPreference.model';

export async function get(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }

  const userID = req.user.id;
  let data;
  try {
    data = await bangumiPreferenceModel.get(userID);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
    return;
  }

  res.send(data || bangumiPreferenceModel.getDefaultPreference());
}

export async function update(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }

  const userID = req.user.id;
  const newData = req.body || {};
  let data;
  try {
    data = await bangumiPreferenceModel.update(userID, newData);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
    return;
  }

  res.send(data || bangumiPreferenceModel.getDefaultPreference());
}
