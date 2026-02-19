/**
 * ==================================
 * BASE API
 * ==================================
 *
 * Core HTTP layer for all API services.
 *
 * Architecture:
 * Flow → Service API → BaseAPI → Playwright Request
 *
 * Responsibilities:
 * ✅ Centralized HTTP methods
 * ✅ AI Metadata tracking
 * ✅ Token/header injection ready
 * ✅ Enterprise scalable design
 *
 * AI Integration:
 * Every request is tracked for dataset learning.
 */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { StepTracker } from '../ai/metadata/step-tracker';

export class BaseAPI {

  protected token?: string;

  constructor(protected request: APIRequestContext) {}

  /**
   * Set auth token (optional)
   */
  setToken(token: string) {

    this.token = token;

  }

  /**
   * Build headers dynamically
   */
  private buildHeaders() {

    const headers: any = {
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;

  }

  /**
   * GET request
   */
  async get(url: string): Promise<APIResponse> {

    StepTracker.addStep({
      action: 'api_get',
      target: url,
      timestamp: Date.now()
    });

    return await this.request.get(url, {
      headers: this.buildHeaders()
    });

  }

  /**
   * POST request
   */
  async post(url: string, data?: any): Promise<APIResponse> {

    StepTracker.addStep({
      action: 'api_post',
      target: url,
      value: JSON.stringify(data),
      timestamp: Date.now()
    });

    return await this.request.post(url, {
      headers: this.buildHeaders(),
      data
    });

  }

  /**
   * PUT request
   */
  async put(url: string, data?: any): Promise<APIResponse> {

    StepTracker.addStep({
      action: 'api_put',
      target: url,
      value: JSON.stringify(data),
      timestamp: Date.now()
    });

    return await this.request.put(url, {
      headers: this.buildHeaders(),
      data
    });

  }

  /**
   * DELETE request
   */
  async delete(url: string): Promise<APIResponse> {

    StepTracker.addStep({
      action: 'api_delete',
      target: url,
      timestamp: Date.now()
    });

    return await this.request.delete(url, {
      headers: this.buildHeaders()
    });

  }

}
