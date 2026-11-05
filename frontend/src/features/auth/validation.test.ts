import { describe, expect, it } from 'vitest';
import { validateLogin, validateRegister } from './validation';

describe('validateRegister', () => {
  it('принимает корректные данные', () => {
    const values = { username: 'anna', email: 'anna@example.com', password: 'secret-1' };
    expect(validateRegister(values)).toEqual({});
  });

  it('проверяет все поля', () => {
    expect(validateRegister({ username: 'a', email: 'bad', password: '1234567' })).toEqual({
      username: 'Минимум 3 символа',
      email: 'Некорректный email',
      password: 'Минимум 8 символов',
    });
  });
});

describe('validateLogin', () => {
  it('не проверяет длину пароля при входе', () => {
    expect(validateLogin({ username: '', email: 'anna@example.com', password: '1' })).toEqual({});
  });

  it('требует email и пароль', () => {
    expect(validateLogin({ username: '', email: '', password: '' })).toEqual({
      email: 'Введите email',
      password: 'Введите пароль',
    });
  });
});
