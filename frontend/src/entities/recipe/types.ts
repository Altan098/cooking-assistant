export interface Ingredient {
    id: number;
    name: string;
    amount: string;
  }
  
  export interface Recipe {
    id: number;
    title: string;
    description: string;
    image: string;
    cookingTime: number;
    servings: number;
    ingredients: Ingredient[];
    steps: string[];
  }