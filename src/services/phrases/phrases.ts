export type PhKeys =
  | 'greeting'
  | 'youtubeLinkValidationError'
  | 'startDownloadLiveMessage'
  | 'errorDownloadLiveMessage'
  | 'successDownloadLiveMessage'
  | 'updateDownloadLiveMessage'
  | 'updateTlgProgress'
  | 'messageWithDescriptionAudio';

type Func = (...args: Array<string | number>) => string;

const store: Record<PhKeys, Func | string> = {
  greeting: (name: string) =>
    `Привет ${name}, пришли мне ссылку на видео, а наш агент пришлет тебе аудио версию`,
  youtubeLinkValidationError: (name: string) =>
    `Что же ты делаешь ${name}?\nЯ не узнаю тут ссылку на Youtube видео`,
  startDownloadLiveMessage: 'Начинаю загрузку',
  successDownloadLiveMessage: 'Готово, наш агент уже все прислал 😎',
  errorDownloadLiveMessage: 'Не получилось...',
  updateDownloadLiveMessage: (t: string) =>
    `Я в процессе, сейчас происходит: \n\n${t}`,
  updateTlgProgress: (t: string) =>
    `[telegram] Загрузка файла: ${t}%`,
  messageWithDescriptionAudio: (filename: string, url: string) =>
    `${filename} \n\n Ссылка на видео: ${url}`,
};

export function getText(key: PhKeys, args?: Array<string | number>): string {
  if (typeof store[key] === 'function') {
    return store[key](...args);
  }
  return store[key];
}
