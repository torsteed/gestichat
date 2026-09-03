export interface User {
  id: number;
  name: string;
}

export interface UserWithMeals extends User {
  meals?: any[];
}
