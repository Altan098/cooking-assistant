import { api } from '../../shared/api/client';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface MealPlanEntry {
  day: number;
  meal: MealType;
  recipe: { id: number; title: string };
}

export const getMealPlan = () => api<MealPlanEntry[]>('/meal-plan/');

export const setMealPlanEntry = (day: number, meal: MealType, recipeId: number) =>
  api<MealPlanEntry>(`/meal-plan/${day}/${meal}`, {
    method: 'PUT',
    body: { recipe_id: recipeId },
  });

export const deleteMealPlanEntry = (day: number, meal: MealType) =>
  api<void>(`/meal-plan/${day}/${meal}`, { method: 'DELETE' });
