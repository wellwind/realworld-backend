import lowdb = require('lowdb');
import FileSync = require('lowdb/adapters/FileSync');
import { NextFunction, Request, Response } from 'express';
const lodashId = require('lodash-id');

export const getDatabase = () => {
  const adapter = new FileSync('./db.json');
  const db = lowdb(adapter);
  db._.mixin(lodashId);
  return db;
};

export const setDbToLocalsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const db = getDatabase();
  res.locals.db = db;
  next();
};
