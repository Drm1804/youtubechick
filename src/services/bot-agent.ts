import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import readline from 'readline';
import { logger } from '../helpers/logger.js';
import { conf } from '../../config.js';

const stringSession = new StringSession(conf.agent);

const log = logger('Agent');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function initAgent() {
  log.info('Start initialization...');
  const { apiId, apiHash } = conf.tlg;

  if (!apiId || !apiHash) {
    log.error(
      'apiId or apiHash is not defined. Application works without the agent',
    );
    return null;
  }

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () =>
      new Promise((resolve) =>
        rl.question('Please enter your number: ', resolve),
      ),
    password: async () =>
      new Promise((resolve) =>
        rl.question('Please enter your password: ', resolve),
      ),
    phoneCode: async () =>
      new Promise((resolve) =>
        rl.question('Please enter the code you received: ', resolve),
      ),
    onError: (err) => log.error(err),
  });

  log.info('You should now be connected.');
  log.info(client.session.save()); // Save this string to avoid logging in again

  return client;
}
