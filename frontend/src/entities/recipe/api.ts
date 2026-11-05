import { api, ApiError } from '../../shared/api/client';
import type { Recipe, RecipeInput } from './types';

interface RecipeDto {
  id: number;
  author_id: number;
  title: string;
  description: string;
  image_url: string;
  cooking_time: number;
  servings: number;
  ingredients: { id: number; name: string; amount: string }[];
  steps: { order: number; text: string }[];
}

export interface RecipeFilters {
  ingredient?: string;
  authorId?: number;
}

interface RecipeQuery extends RecipeFilters {
  skip?: number;
  limit?: number;
}

export interface RecipePage {
  items: Recipe[];
  total: number;
}

function fromDto(dto: RecipeDto): Recipe {
  return {
    id: dto.id,
    authorId: dto.author_id,
    title: dto.title,
    description: dto.description,
    image: dto.image_url,
    cookingTime: dto.cooking_time,
    servings: dto.servings,
    ingredients: dto.ingredients.map(({ id, name, amount }) => ({ id, name, amount })),
    steps: dto.steps.map((step) => step.text),
  };
}

function toDto(input: RecipeInput) {
  return {
    title: input.title,
    description: input.description,
    cooking_time: input.cookingTime,
    servings: input.servings,
    ingredients: input.ingredients,
    steps: input.steps.map((text, order) => ({ order, text })),
  };
}

export async function getRecipes({ ingredient, authorId, skip, limit }: RecipeQuery = {}): Promise<RecipePage> {
  const params = new URLSearchParams();
  if (ingredient) params.set('ingredient', ingredient);
  if (authorId !== undefined) params.set('author_id', String(authorId));
  if (skip !== undefined) params.set('skip', String(skip));
  if (limit !== undefined) params.set('limit', String(limit));
  const query = params.size > 0 ? `?${params}` : '';

  const page = await api<{ items: RecipeDto[]; total: number }>(`/recipes/${query}`);
  return { items: page.items.map(fromDto), total: page.total };
}

export async function getRecipe(id: number): Promise<Recipe> {
  if (!Number.isInteger(id)) throw new ApiError(404, 'Рецепт не найден');
  return fromDto(await api<RecipeDto>(`/recipes/${id}`));
}

export async function createRecipe(input: RecipeInput): Promise<Recipe> {
  return fromDto(await api<RecipeDto>('/recipes/', { method: 'POST', body: toDto(input) }));
}

export async function updateRecipe(id: number, input: RecipeInput): Promise<Recipe> {
  return fromDto(await api<RecipeDto>(`/recipes/${id}`, { method: 'PATCH', body: toDto(input) }));
}

export async function uploadRecipeImage(id: number, file: File): Promise<Recipe> {
  const body = new FormData();
  body.append('image', file);
  return fromDto(await api<RecipeDto>(`/recipes/${id}/image`, { method: 'PUT', body }));
}

export const deleteRecipe = (id: number) => api<void>(`/recipes/${id}`, { method: 'DELETE' });
