import { conf } from '../../../config.js';
import { uuidv4 } from '@firebase/util';
import { logger } from '../../helpers/logger.js';
import { exec } from 'child_process';
import { getAgent, getBot } from '../../services/bot.js';
import { getLmText, throttle } from './live-message.js';
import { getText } from '../../services/phrases/phrases.js';
import { getLoadPh } from '../../services/phrases/load-file.phrases.js';

const log = logger('File Manager');

const getCommand = (internalId: string, url: string) => {
  return `yt-dlp -f bestaudio -x --audio-format mp3 -o "${conf.storagePath}${internalId}.%(ext)s" ${url}`;
};

const getFileWithPath = (internalId: string) =>
  `${conf.storagePath}${internalId}.mp3`;

export async function getFileAndSendViaAgent(
  chatId: number,
  messageId: number,
  userId: string,
  url: string,
) {
  const bot = getBot();
  const internalId = uuidv4();
  const editMes = bot.api.editMessageText.bind(bot.api, chatId, messageId);

  const cb = (data: string) =>
    throttle(editMes.bind(null, getLmText('update', data)));

  const isSuccessDownload = await download(url, internalId, cb);

  if (!isSuccessDownload) {
    log.info('Not success download');
    return await editMes(getText('errorDownloadLiveMessage'));
  }

  const agent = getAgent();

  setTimeout(() => {
    editMes(getText('updateDownloadLiveMessage', [getLoadPh()]));
  }, 800);

  try {
    log.info('Начала загружать файлы в телегу' + userId);
    await agent.sendFile(userId, {
      file: getFileWithPath(internalId),
      voiceNote: true,
    });

    // clearInterval(intervalKey);
    await removeFile(internalId);
  } catch (err) {
    return false;
  }

  return true;
}
type Func = (...args: string[]) => void;
export async function download(
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

async function removeFile(internalId: string) {
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
