/**
 * BASE API
 *
 * File này là lớp base cho tất cả API class.
 * Chứa các method dùng chung như GET, POST, PUT, DELETE.
 */

import { APIRequestContext } from '@playwright/test';

export class BaseAPI {
  protected request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  // GET request
  async get(url: string) {
    return this.request.get(url);
  }

  // POST request
  async post(url: string, data: any) {
    return this.request.post(url, { data });
  }

  // PUT request
  async put(url: string, data: any) {
    return this.request.put(url, { data });
  }

  // DELETE request
  async delete(url: string) {
    return this.request.delete(url);
  }
}
