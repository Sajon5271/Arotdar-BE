import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/User.model';
import { Request, Response, NextFunction } from 'express';

const SECRET_KEY = process.env.SECRET_KEY;

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeaders = req.headers['authorization'];
  if (!authHeaders) return res.sendStatus(403);
  const token = authHeaders.split(' ')[1];
  try {
    const { _id } = jwt.verify(token, SECRET_KEY || '') as JwtPayload;
    // attempt to find user object and set to req
    const user = await User.findOne({ _id });
    if (!user) return res.sendStatus(401);
    // TODO: Fix it
    // @ts-ignore
    req['currentUser'] = user;
    next();
  } catch (error) {
    res.sendStatus(401);
    next();
  }
};
