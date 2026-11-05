import { createBrowserRouter } from 'react-router-dom';
import Layout from '../shared/ui/Layout';
import { RequireAuth, UserMenu } from '../features/auth';
import ErrorPage from '../pages/ErrorPage';
import {
  EditRecipePage,
  HomePage,
  LoginPage,
  MealPlanPage,
  NewRecipePage,
  NotFoundPage,
  ProfilePage,
  RecipeDetailsPage,
  RecipesPage,
  RegisterPage,
  SearchPage,
  ShoppingListPage,
} from '../pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout navbarActions={<UserMenu />} />,
    errorElement: <ErrorPage />,
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
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
