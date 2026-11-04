import { createBrowserRouter } from 'react-router-dom';
import Layout from '../shared/ui/Layout';
import { RequireAuth, UserMenu } from '../features/auth';
import HomePage from '../pages/HomePage';
import RecipesPage from '../pages/RecipesPage';
import RecipeDetailsPage from '../pages/RecipeDetailsPage';
import NewRecipePage from '../pages/NewRecipePage';
import EditRecipePage from '../pages/EditRecipePage';
import SearchPage from '../pages/SearchPage';
import ShoppingListPage from '../pages/ShoppingListPage';
import MealPlanPage from '../pages/MealPlanPage';
import ProfilePage from '../pages/ProfilePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout navbarActions={<UserMenu />} />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'recipes', element: <RecipesPage /> },
      { path: 'recipes/:id', element: <RecipeDetailsPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: 'recipes/new', element: <NewRecipePage /> },
          { path: 'recipes/:id/edit', element: <EditRecipePage /> },
          { path: 'shopping-list', element: <ShoppingListPage /> },
          { path: 'meal-plan', element: <MealPlanPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
]);
