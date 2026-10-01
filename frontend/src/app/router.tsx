import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import RecipesPage from '../pages/RecipesPage';
import RecipeDetailsPage from '../pages/RecipeDetailsPage';
import NewRecipePage from '../pages/NewRecipePage';
import SearchPage from '../pages/SearchPage';
import ShoppingListPage from '../pages/ShoppingListPage';
import MealPlanPage from '../pages/MealPlanPage';
import ProfilePage from '../pages/ProfilePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'recipes', element: <RecipesPage /> },
      { path: 'recipes/new', element: <NewRecipePage /> },
      { path: 'recipes/:id', element: <RecipeDetailsPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'shopping-list', element: <ShoppingListPage /> },
      { path: 'meal-plan', element: <MealPlanPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
]);