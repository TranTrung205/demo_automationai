/**
 * API Data Loader
 * ---------------
 * Loads API payload test data.
 */

import fs from 'fs';
import path from 'path';

export function loadAPIData(file: string) {

  const filePath = path.resolve(`data/api/${file}`);

  const raw = fs.readFileSync(filePath, 'utf-8');

  return JSON.parse(raw);

}
