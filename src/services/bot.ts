import { Bot, Context, NextFunction, session } from 'grammy';
import { logger } from '../helpers/logger.js';
import { getText } from './phrases/phrases.js';
import { getHears } from '../components/youtubchick/hears.js';
import { TelegramClient } from 'telegram';
import { initAgent } from './bot-agent.js';

const ADMIN_IDS = [176159587, 238642334, 1922790663, 2039756842];
const log = logger('Bot Service');

export type BotContext = Context;

let bot: Bot<BotContext>;
let agent: TelegramClient;

export function getBot() {
  return bot;
}

export function getAgent() {
  return agent;
}

async function isAdmin(ctx: BotContext, next: NextFunction) {
  if (ADMIN_IDS.includes(ctx.from.id)) {
    await next();
  }
}

export async function initBot(botToken: string) {
  bot = new Bot<BotContext>(botToken);

  bot.use(
    session({
      initial() {
        return {
          db: {},
        };
      },
    }),
  );

  bot.use(isAdmin);

  getHears(bot);

  bot.catch((error) => {
    console.log('bot error', error);
  });

  bot.on('callback_query:data', async (ctx) => {
    console.log('Unknown button event with payload', ctx.callbackQuery.data);
    await ctx.answerCallbackQuery(); // remove loading animation
  });

  bot.command('start', (ctx) => {
    const name = ctx.from.username || ctx.from.id;
    ctx.reply(getText('greeting', [name]));
  });

  bot.catch((error) => {
    log.error('bot error', error);
  });

  bot.start({
    onStart(botInfo) {
      log.info('Bot starts as', botInfo.username);
    },
  });

  agent = await initAgent();

  return { bot, agent };
}
