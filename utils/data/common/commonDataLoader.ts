/**
 * Common Data Loader
 * ------------------
 * Shared configuration loader
 */

import fs from 'fs';
import path from 'path';

export function loadCommonData(file: string) {

  const filePath = path.resolve(`data/common/${file}`);

  const raw = fs.readFileSync(filePath, 'utf-8');

  return JSON.parse(raw);

}
