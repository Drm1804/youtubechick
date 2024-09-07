import { conf } from '../../../config.js';
import { DEFAULT_EXT } from './file-manager/const.js';

export const getFileWithPath = (internalId: string, ext = DEFAULT_EXT) =>
  `${conf.storagePath}${internalId}.${ext}`;

export const isYoutubeUrlValid = (url: string) => {
  const reg =
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;
  return reg.test(url);
};
