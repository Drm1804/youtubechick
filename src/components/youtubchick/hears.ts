import { Bot } from 'grammy';
import { getText } from '../../services/phrases/phrases.js';
import { BotContext, getBot } from '../../services/bot.js';
import { addVideoToQueue, isPossibleTakeTask } from '../../services/queue.js';
import { isYoutubeUrlValid } from './utils.js';

export function getHears(bot: Bot<BotContext>) {
  bot.on(':text', async (ctx, next) => {
    const name = ctx.from.username || ctx.from.id;
    const url = ctx.message.text;

    if (!isYoutubeUrlValid(url)) {
      return ctx.reply(getText('youtubeLinkValidationError', [name]));
    }

    if (!isPossibleTakeTask()) {
      return ctx.reply(getText('botIsOverload'));
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

    addVideoToQueue({
      bot,
      message,
      chantId,
      message_id,
      name,
      url,
    });

    return await next();
  });
}
