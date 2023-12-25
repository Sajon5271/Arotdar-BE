import { NextFunction, Request, Response } from 'express';
import { User, UserModel } from '../models/User.model';

export const CreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: UserModel = req.body;
  try {
    if (!user) throw new Error('User data not provided');
    const userExists = await User.find({ email: user.email });
    if (userExists) throw new Error('User already exists');
    const newUser = new User(user);
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send(typeof error === 'string' ? error : 'Something went wrong');
    next();
  }
};
