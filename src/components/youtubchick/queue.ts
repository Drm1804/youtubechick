import { logger } from '../../helpers/logger.js';

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
