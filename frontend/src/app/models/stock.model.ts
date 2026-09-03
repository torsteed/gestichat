import { User } from './user.model';

export interface Stock {
  id: number;
  sachets_added: number;
  added_at: string | Date;
  user_id: number;
  note: string | null;
  User?: User;
}

export interface StockCreate {
  sachets_added: number;
  user_id: number;
  note?: string;
}

export interface StockCurrent {
  currentStock: number;
}
