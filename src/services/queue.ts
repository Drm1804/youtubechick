import { getFileAndSendViaAgent } from '../components/youtubchick/file-manager/file-manager.js';
import { logger } from '../helpers/logger.js';
import { getText } from './phrases/phrases.js';

let count = 0;
const LIMIT = 1;

const log = logger('Queue service');

export function isPossibleTakeTask(): boolean {
  log.info('isPossibleTakeTask', count <= LIMIT, 'count: ' + count);
  return count <= LIMIT;
}

export function increaseTaskCount() {
  count += 1;
  log.info('increaseTaskCount', 'Now count is ' + count);
}

export function decreaseTaskCount() {
  count -= 1;
  log.info('decreaseTaskCount', 'Now count is ' + count);
}

export type AddVideoToQueueParams = {
  chantId: number;
  message_id: number;
  name: string | number;
  url: string;
  bot: any;
  message;
};

export async function addVideoToQueue(params: AddVideoToQueueParams) {
  try {
    increaseTaskCount();
    const { chantId, message_id, name, url, bot, message } = params;
    log.info('addVideoToQueue', message_id, name, url);

    const isSuccess = await getFileAndSendViaAgent(
      chantId,
      message_id,
      name,
      url,
    );

    log.info('addVideoToQueue', 'isSuccess: ' + isSuccess);
    decreaseTaskCount();
    if (isSuccess) {
      return await bot.api.editMessageText(
        message.chat.id,
        message.message_id,
        getText('successDownloadLiveMessage'),
      );
    }

    return await bot.api.editMessageText(
      message.chat.id,
      message.message_id,
      getText('errorDownloadLiveMessage'),
    );
  } catch (err) {
    log.error(err);
  }
}
