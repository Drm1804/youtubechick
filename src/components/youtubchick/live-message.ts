import { getText } from '../../services/phrases/phrases.js';

export type eventType = 'start' | 'update' | 'success' | 'error';

// type LiveMessageFunction = (
//   cb: Function,
//   type: eventType,
//   update?: string,
// ) => void;

// export const liveMessage: LiveMessageFunction = (cb, type, update) => {
//   return throttle(cb.bind(null, getLmText(type, update)));
// };

export const getLmText = (type: eventType, update?: string) => {
  if (type === 'start') return getText('startDownloadLiveMessage');
  if (type === 'error') return getText('errorDownloadLiveMessage');
  if (type === 'success') return getText('successDownloadLiveMessage');
  return getText('updateDownloadLiveMessage', [update]);
};

type Func = () => void;

let isBlock = false;
export function throttle(cb: Func, interval = 500) {
  if (isBlock) return;
  cb();
  isBlock = true;

  setTimeout(() => {
    isBlock = false;
  }, interval);
}
