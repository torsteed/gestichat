import { Cat } from './cat.model';
import { User } from './user.model';

export interface Meal {
  id: number;
  cat_id: number;
  user_id: number;
  fed_at: string | Date;
  sachets_used: number;
  created_at: string | Date;
  Cat?: Cat;
  User?: User;
  fed_at_formatted?: string;
  isRecent?: boolean;
}

export interface MealCreate {
  cat_id: number;
  user_id: number;
  fed_at?: string | Date;
  sachets_used?: number;
}
