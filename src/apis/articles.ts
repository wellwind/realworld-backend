import { NextFunction, Request, Response } from 'express-serve-static-core';
import shortid from 'shortid';
import slug from 'slug';
import { Article, CreateArticle } from '../models/article';
import { User } from '../models/user';
import { getTokenFromRequest, verifyToken } from '../utils/auth';
import { getDatabase } from '../utils/database';

export const getArticles = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const db = getDatabase();

  res.json({ articles: db.get('articles') });
  next();
};

export const getArticle = (req: Request, res: Response, next: NextFunction) => {
  const db = getDatabase();

  const result = db.get('articles').find({ slug: req.params.slug });

  res.json({ article: result.value() });
  next();
};

export const articleTitleExist = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const db = getDatabase();

  const article = db
    .get('articles')
    .find({ title: req.params.title })
    .value();

  res.json({ titleExist: !!article });
  next();
};

export const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const createArticle = (req.body.article || {}) as CreateArticle;

  if (!createArticle.title) {
    res.status(500).json({ message: 'Must enter title' });
    next();
    return;
  }

  const token = getTokenFromRequest(req);
  const user = (await verifyToken(token)) as User;

  const db = getDatabase();

  const author = db
    .get('users')
    .find({ email: user.email })
    .value() as User;

  const article: Article = {
    slug: `${slug(createArticle.title.toLowerCase())}-${shortid.generate()}`,
    title: createArticle.title,
    description: createArticle.description,
    body: createArticle.body,
    tagList: createArticle.tagList,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: user.username
  };

  db.get('articles')
    .push(article)
    .write();

  res.status(200).json(article);
  next();
};
