import { Request, Response } from 'express';
import userModel, { UserFull } from '../models/user.model';
import { User } from 'bangumi-list-v3-shared';
import jwt from 'jsonwebtoken';
import tokenModel from '../models/token.model';

export async function create(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  let isEmailValid = false;
  try {
    isEmailValid = await userModel.checkEmailValid(email);
  } catch (error) {
    res.status(500).send({ message: 'Create user failed' });
    return;
  }
  if (!isEmailValid) {
    res.status(500).send({ message: 'Email is invalid' });
    return;
  }

  let id;
  try {
    id = await userModel.addUser({
      email,
      password,
    });
  } catch (error) {
    res.status(500).send({ message: 'Create user failed' });
    return;
  }

  res.status(201).send({ id });
}

export async function getMe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }

  const userID = req.user.id;

  let data: UserFull | null;
  try {
    data = await userModel.getUser(userID);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
    return;
  }

  if (!data) {
    res.sendStatus(404);
    return;
  }

  const user: User = {
    email: data.email,
    id: data.id,
  };

  res.send(user);
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  let user: UserFull | null;
  try {
    user = await userModel.verifyUserByEmail(email, password);
  } catch (e) {
    res.sendStatus(401);
    return;
  }

  if (user === null) {
    res.sendStatus(401);
    return;
  }

  const token = jwt.sign(
    { userID: user.id, userRole: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '1y' }
  );

  await tokenModel.add(user.id, token);

  res.status(200).send({ token });
}

export async function logout(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }

  await tokenModel.remove(req.user.id, req.user.token);

  res.sendStatus(200);
}

export async function update(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }

  const userID = req.user.id;
  const { oldPassword, newPassword } = req.body;
  let isOldPasswordCorrect = false;
  try {
    const user = await userModel.verifyUserByID(userID, oldPassword);
    if (user) isOldPasswordCorrect = true;
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
    return;
  }

  if (!isOldPasswordCorrect) {
    res.sendStatus(401);
    return;
  }

  try {
    await userModel.changePassword(userID, newPassword);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
    return;
  }

  res.sendStatus(200);
}
