/**
 * UI Data Loader
 * --------------
 * Loads UI specific test data.
 */

import fs from 'fs';
import path from 'path';

export function loadUIData(file: string) {

  const filePath = path.resolve(`data/ui/${file}`);

  const raw = fs.readFileSync(filePath, 'utf-8');

  return JSON.parse(raw);

}
