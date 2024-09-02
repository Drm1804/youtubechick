import { uuidv4 } from '@firebase/util';
import { logger } from '../../../helpers/logger.js';
import { getAgent, getBot } from '../../../services/bot.js';
import { getLmText, throttle } from '../live-message.js';
import { getText } from '../../../services/phrases/phrases.js';
import { Api } from 'telegram';
import { getFileWithPath } from '../utils.js';
import { getAudioInfo } from '../video-info.js';
import { pause } from '../../../helpers/utils.js';
// import { pyDownload } from './python-downloader.js';
import { exec } from 'child_process';
import { DEFAULT_EXT } from './const.js';
import { jsDownload } from './native-downloader.js';

const log = logger('File Manager');

export async function getFileAndSendViaAgent(
  chatId: number,
  messageId: number,
  name: string | number,
  url: string,
) {
  const bot = getBot();
  const internalId = uuidv4();
  const editMes = bot.api.editMessageText.bind(bot.api, chatId, messageId);

  const cb = (data: string) =>
    throttle(editMes.bind(null, getLmText('update', data)));

  const isSuccessDownload = await jsDownload(url, internalId, cb);

  if (!isSuccessDownload) {
    log.info('Not success download');
    return await editMes(getText('errorDownloadLiveMessage'));
  }

  const agent = getAgent();

  try {
    log.info('Начала загружать файлы в телегу ' + name);

    const info = await getAudioInfo(internalId);

    const { duration, title, artist } = info || {};
    try {
      await agent.sendFile(name, {
        file: getFileWithPath(internalId, DEFAULT_EXT),
        caption: getText('messageWithDescriptionAudio', [title, url]),
        attributes: [
          new Api.DocumentAttributeAudio({
            duration,
            voice: false,
            title,
            performer: artist,
            waveform: undefined,
          }),
        ],
        progressCallback: (pr) =>
          cb(getText('updateTlgProgress', [Math.round(pr * 100)])),
      });
    } catch (err) {
      log.error(err);
    }

    log.info('Pause between remove file');

    await pause(1000);
    await removeFile(internalId);
  } catch (err) {
    log.error(err);
    return false;
  }

  return true;
}

async function removeFile(internalId: string) {
  log.info('removeFile');
  return new Promise((resolve) => {
    const command = `rm ${getFileWithPath(internalId)}`;

    exec(command, (error) => {
      if (error) {
        log.warn(error);
      }

      resolve(true);
    });
  });
}
