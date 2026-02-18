import { APIRequestContext } from '@playwright/test';
import { ProductAPI } from '../../api/product.api';

export class ProductFlow {
  private productApi: ProductAPI;

  constructor(request: APIRequestContext) {
    this.productApi = new ProductAPI(request);
  }

  async getAllProducts() {
    return await this.productApi.getAllProducts();
  }

  async getFirstProduct() {
    const products = await this.getAllProducts();
    return products[0];
  }
}
