import { logger } from '../../../helpers/logger.js';
import { exec } from 'child_process';
import { DEFAULT_EXT } from './const.js';
import { conf } from '../../../../config.js';

const log = logger('Python Downloader');

const getCommand = (internalId: string, url: string) => {
  return `yt-dlp --embed-metadata -f bestaudio -x --audio-format ${DEFAULT_EXT} -o "${conf.storagePath}${internalId}.%(ext)s" ${url}`;
};

type Func = (...args: string[]) => void;

// @deprecated - вызывать при каждой загрузке дочерний питоновский процесс кажется дорого. 
// тем не менее способ отлично работает. Оставил его для истории
export async function pyDownload(
  url: string,
  internalId: string,
  updateCb: Func,
): Promise<string | undefined> {
  log.info('File name ' + internalId);
  return new Promise((resolve) => {
    const command = getCommand(internalId, url);

    const process = exec(command, (error) => {
      if (error) {
        log.error('downloadFile error');
        log.error(error);
        resolve(undefined);
      }

      resolve(internalId);
    });

    process.stdout.on('data', function (data) {
      log.info(data);
      updateCb(data);
    });
  });
}
