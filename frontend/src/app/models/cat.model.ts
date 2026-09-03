export interface Cat {
  id: number;
  name: string;
  active: boolean;
}

export interface CatWithMeals extends Cat {
  meals?: any[];
}
