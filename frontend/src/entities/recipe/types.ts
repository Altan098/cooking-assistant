export interface Ingredient {
  id: number;
  name: string;
  amount: string;
}

export interface Recipe {
  id: number;
  authorId: number;
  title: string;
  description: string;
  image: string;
  cookingTime: number;
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
}

export interface RecipeInput {
  title: string;
  description: string;
  cookingTime: number;
  servings: number;
  ingredients: Omit<Ingredient, 'id'>[];
  steps: string[];
}
