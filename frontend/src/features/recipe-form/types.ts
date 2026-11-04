export interface IngredientRow {
  name: string;
  amount: string;
}

export interface RecipeFormValues {
  title: string;
  description: string;
  image: string;
  cookingTime: string;
  servings: string;
  ingredients: IngredientRow[];
  steps: string[];
}

export type RecipeFormErrors = Partial<Record<keyof RecipeFormValues, string>>;

export type RecipeFormStatus = 'idle' | 'submitting' | 'error';
