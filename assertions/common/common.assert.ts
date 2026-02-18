/**
 * Common Assertions Helpers
 */

import { expect } from '@playwright/test';

export class CommonAssertions {

  static verifyStatus(status: number, expected: number) {
    expect(status).toBe(expected);
  }

}
