/**
 * ==================================
 * BaseAPI
 * ==================================
 * Base class cho tất cả API services
 *
 * Handles:
 *  - Base URL
 *  - Headers
 *  - Token Authorization
 */

import { APIRequestContext } from '@playwright/test';

export class BaseAPI {

  constructor(protected request: APIRequestContext) {}

  protected async get(
    url: string,
    token?: string
  ) {

    return this.request.get(url, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {}
    });

  }

  protected async post(
    url: string,
    body: any,
    token?: string
  ) {

    return this.request.post(url, {
      data: body,
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {}
    });

  }

  protected async put(
    url: string,
    body: any,
    token?: string
  ) {

    return this.request.put(url, {
      data: body,
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {}
    });

  }

  protected async delete(
    url: string,
    token?: string
  ) {

    return this.request.delete(url, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {}
    });

  }

}
