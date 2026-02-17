import { test, expect, request } from '@playwright/test';

test('GET product by id', async () => {
  const apiContext = await request.newContext({
    baseURL: 'https://fakestoreapi.com',
  });

  const response = await apiContext.get('/products/1');

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.id).toBe(1);
  expect(body.title).toBeTruthy();
  expect(body.price).toBeGreaterThan(0);
});
