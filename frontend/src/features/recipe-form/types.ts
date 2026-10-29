export interface RecipeFormValues {
    title: string;
    description: string;
    image: string;
    cookingTime: string;
    servings: string;
    ingredients: string;
    steps: string;
  }
  
  export type RecipeFormErrors = Partial<Record<keyof RecipeFormValues, string>>;
  
  export type RecipeFormStatus = 'idle' | 'submitting' | 'success' | 'error';