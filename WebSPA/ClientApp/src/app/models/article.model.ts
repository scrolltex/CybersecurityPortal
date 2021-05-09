import { Category } from './category.model';
import { User } from './user.model';

export interface Article {
  id: string;
  user: User;
  categoryId: string;
  category?: Category;
  title: string;
  content: string;
  createdAt: Date | string;
}
