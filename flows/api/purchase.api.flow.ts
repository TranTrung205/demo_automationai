/**
 * Purchase API Flow
 * -----------------
 * Handles checkout via API.
 */

import { PurchaseAPI } from '../../api/purchase.api';

export class PurchaseAPIFlow {

  /**
   * Complete purchase via API
   */
  static async checkout(token: string, payload: any) {

    return await PurchaseAPI.checkout(token, payload);

  }

}
