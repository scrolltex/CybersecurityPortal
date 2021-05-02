import { Category } from './category.model';

export interface Article {
  id: string;
  categoryId: string;
  category?: Category;
  title: string;
  content: string;
  createdAt: Date | string;
}
