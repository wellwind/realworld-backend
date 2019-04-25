import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';

export const createToken = (payload: any) =>
  jwt.sign(payload, config.jwtSecretKey, { expiresIn: config.jwtExpiredIn });

export const verifyToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtSecretKey, (error, result) => {
      if (result !== undefined) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

export const verifyTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = getTokenFromRequest(req);

  try {
    await verifyToken(token);
  } catch (error) {
    res.status(401).send();
  }
  next();
};

export const getTokenFromRequest = (req: Request) =>
  (req.headers.authorization || '').split(' ')[1];
