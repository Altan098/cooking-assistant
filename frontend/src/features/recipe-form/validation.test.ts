import { describe, expect, it } from 'vitest';
import type { RecipeFormValues } from './types';
import { validateImageFile, validateRecipeForm } from './validation';

const valid: RecipeFormValues = {
  title: 'Плов',
  description: '',
  image: '/api/uploads/photo.jpg',
  imageFile: null,
  cookingTime: '40',
  servings: '4',
  ingredients: [{ name: 'Рис', amount: '2 стакана' }],
  steps: ['Варить'],
};

describe('validateRecipeForm', () => {
  it('принимает корректный рецепт', () => {
    expect(validateRecipeForm(valid)).toEqual({});
  });

  it('требует фото', () => {
    expect(validateRecipeForm({ ...valid, image: '' }).image).toBe('Добавьте фото блюда');
  });

  it('принимает новый рецепт с выбранным файлом', () => {
    const imageFile = new File(['x'], 'photo.png', { type: 'image/png' });
    expect(validateRecipeForm({ ...valid, image: '', imageFile })).toEqual({});
  });

  it('проверяет тип и размер файла', () => {
    const text = new File(['x'], 'notes.txt', { type: 'text/plain' });
    const huge = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'big.jpg', { type: 'image/jpeg' });
    expect(validateImageFile(text)).toBe('Выберите файл JPEG, PNG или WebP');
    expect(validateImageFile(huge)).toBe('Файл больше 5 МБ');
  });

  it('требует название из трёх символов', () => {
    expect(validateRecipeForm({ ...valid, title: '  ' }).title).toBe('Введите название');
    expect(validateRecipeForm({ ...valid, title: 'Чай'.slice(0, 2) }).title).toBe('Минимум 3 символа');
  });

  it.each(['', '0', '-5', '1.5', 'abc'])('отклоняет время приготовления «%s»', (cookingTime) => {
    expect(validateRecipeForm({ ...valid, cookingTime }).cookingTime).toBeDefined();
  });

  it('ограничивает число порций', () => {
    expect(validateRecipeForm({ ...valid, servings: '0' }).servings).toBeDefined();
    expect(validateRecipeForm({ ...valid, servings: '1001' }).servings).toBeDefined();
  });

  it('игнорирует пустые строки ингредиентов', () => {
    const ingredients = [...valid.ingredients, { name: ' ', amount: '' }];
    expect(validateRecipeForm({ ...valid, ingredients }).ingredients).toBeUndefined();
  });

  it('требует хотя бы один ингредиент и шаг', () => {
    const errors = validateRecipeForm({
      ...valid,
      ingredients: [{ name: '', amount: '' }],
      steps: ['  '],
    });
    expect(errors.ingredients).toBe('Укажите хотя бы один ингредиент');
    expect(errors.steps).toBe('Опишите хотя бы один шаг');
  });

  it('не принимает ингредиент без количества', () => {
    const errors = validateRecipeForm({ ...valid, ingredients: [{ name: 'Соль', amount: '' }] });
    expect(errors.ingredients).toBe('Для каждого ингредиента укажите название и количество');
  });
});
