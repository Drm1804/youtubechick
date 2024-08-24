import { Bot } from 'grammy';
import { getText } from '../../services/phrases/phrases.js';
import { BotContext, getBot } from '../../services/bot.js';
import ytbUtils from 'youtube-url';

import { getFileAndSendViaAgent } from './file-manager.js';

export function getHears(bot: Bot<BotContext>) {
  bot.on(':text', async (ctx) => {
    const name = ctx.from.username || ctx.from.id;
    const url = ctx.message.text;

    if (!ytbUtils.valid(url)) {
      return ctx.reply(getText('youtubeLinkValidationError', [name]));
    }

    const message = await ctx.reply(getText('startDownloadLiveMessage'));

    const {
      chat: { id: chantId, username },
      message_id,

    } = message || {};

    const bot = getBot();

    if (!username || !chantId || !message_id) {
      return '';
    }

    const isSuccess = await getFileAndSendViaAgent(
      chantId,
      message_id,
      username,
      url,
    );

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
