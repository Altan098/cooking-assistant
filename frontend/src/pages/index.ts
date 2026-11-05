import { lazy } from 'react';

// Код каждой страницы загружается только при переходе на неё.
export const HomePage = lazy(() => import('./HomePage'));
export const RecipesPage = lazy(() => import('./RecipesPage'));
export const RecipeDetailsPage = lazy(() => import('./RecipeDetailsPage'));
export const NewRecipePage = lazy(() => import('./NewRecipePage'));
export const EditRecipePage = lazy(() => import('./EditRecipePage'));
export const SearchPage = lazy(() => import('./SearchPage'));
export const ShoppingListPage = lazy(() => import('./ShoppingListPage'));
export const MealPlanPage = lazy(() => import('./MealPlanPage'));
export const ProfilePage = lazy(() => import('./ProfilePage'));
export const LoginPage = lazy(() => import('./LoginPage'));
export const RegisterPage = lazy(() => import('./RegisterPage'));
export const NotFoundPage = lazy(() => import('./NotFoundPage'));
