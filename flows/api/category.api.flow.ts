/**
 * ==================================
 * Category API Flow
 * ==================================
 * Business flow layer for category operations.
 *
 * Responsibility:
 * Flow → orchestration logic
 * API  → HTTP communication
 *
 * Used by:
 * - Tests
 * - Hybrid flows
 * - Future AI agent
 */

import { APIRequestContext } from '@playwright/test';
import { CategoryAPI } from '../../api/category.api';

export class CategoryAPIFlow {

  private categoryAPI: CategoryAPI;

  constructor(private request: APIRequestContext) {
    this.categoryAPI = new CategoryAPI(request);
  }

  /**
   * ==================================
   * Get all categories
   * ==================================
   */
  async getCategories() {

    const response = await this.categoryAPI.getAllCategories();

    return await response.json();
  }

  /**
   * ==================================
   * Get products by category
   * ==================================
   */
  async getProductsByCategory(category: string) {

    const response = await this.categoryAPI.getProductsByCategory(category);

    return await response.json();
  }

}
