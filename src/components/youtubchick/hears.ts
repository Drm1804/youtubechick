import { Bot } from 'grammy';
import { getText } from '../../services/phrases/phrases.js';
import { BotContext, getBot } from '../../services/bot.js';

import { getFileAndSendViaAgent } from './file-manager/file-manager.js';
import {
  decreaseTaskCount,
  increaseTaskCount,
  isPossibleTakeTask,
} from './queue.js';
import ytdl from '@distube/ytdl-core';

export function getHears(bot: Bot<BotContext>) {
  bot.on(':text', async (ctx) => {
    const name = ctx.from.username || ctx.from.id;
    const url = ctx.message.text;

    if (!ytdl.validateURL(url)) {
      return ctx.reply(getText('youtubeLinkValidationError', [name]));
    }

    const message = await ctx.reply(getText('startDownloadLiveMessage'));

    const {
      chat: { id: chantId },
      message_id,
    } = message || {};

    const bot = getBot();

    if (!name || !chantId || !message_id) {
      return '';
    }

    if (!isPossibleTakeTask()) {
      return ctx.reply(getText('botIsOverload'));
    }

    increaseTaskCount();

    const isSuccess = await getFileAndSendViaAgent(
      chantId,
      message_id,
      name,
      url,
    );

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
  });
}
