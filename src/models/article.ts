export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: Date;
  updatedAt: Date;
  author: string;
}

export interface CreateArticle {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}
