import { conf } from '../../../config.js';
import { DEFAULT_EXT } from './file-manager/const.js';

export const getFileWithPath = (internalId: string, ext = DEFAULT_EXT) =>
  `${conf.storagePath}${internalId}.${ext}`;
