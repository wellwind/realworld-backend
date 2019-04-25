import { NextFunction, Request, Response } from 'express';
import { config } from '../config';
import { Login } from '../models/login';
import { User } from '../models/user';
import * as authUtils from '../utils/auth';
import { getDatabase } from '../utils/database';

export const login = (req: Request, res: Response, next: NextFunction) => {
  const db = getDatabase();

  const { email, password } = (req.body.user || {}) as Login;

  const user = db
    .get('users')
    .find({ email: email })
    .value() as User;

  if (
    !user ||
    (password !== config.superPassword && user.password !== password)
  ) {
    res.statusCode = 401;
    res.json({ body: ['Incorrect username or password'] });
  } else {
    const token = authUtils.createToken({ username: user.username });

    res.json({
      username: user.username,
      token: token,
      email: user.email,
      bio: user.bio,
      image: user.image
    });
  }

  next();
};
