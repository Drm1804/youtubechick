import { logger } from '../../../helpers/logger.js';
import ytdl from '@distube/ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import { conf } from '../../../../config.js';
import { getText } from '../../../services/phrases/phrases.js';

const log = logger('JS Downloader');

type Func = (...args: string[]) => void;
export async function jsDownload(
  url: string,
  internalId: string,
  updateCb?: Func,
) {
/*eslint no-async-promise-executor: "warn"*/
  return new Promise(async (resolve) => {
    log.info('File name ' + internalId);

    const videoID = ytdl.getURLVideoID(url);

    const stream = ytdl(videoID, {
      filter: (format) => format.container === 'mp4' && format.hasAudio,
    })
      .on('error', (err) => {
        log.error(`Error downloading, skipping... `);
        log.error(err);
        resolve(false);
      })
      .on('progress', (_, downloaded, total) => {
        const data = `Download progress ${((downloaded / total) * 100).toFixed(
          2,
        )}% done`;
        updateCb(data);
      });

    const convertRes = await convertToMp3(
      stream,
      conf.storagePath + internalId + '.mp3',
      updateCb,
    );
    resolve(convertRes);
  });
}

function convertToMp3(stream, fullPath: string, updateCb: Func) {
  log.info('convertToMp3');
  updateCb(getText('convertToAudio'));
  return new Promise((resolve) => {
    ffmpeg(stream)
      .inputFormat('mp4')
      .toFormat('mp3')
      .audioBitrate(128)
      .save(fullPath)
      .on('error', (err) => {
        log.error(`Error processing ffmpeg \n ${err}`);
        return resolve(false);
      })
      .on('end', () => {
        log.info(`File saved `);
        return resolve(true);
      });
  });
}
