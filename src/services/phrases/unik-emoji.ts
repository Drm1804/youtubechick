const em = [
  '👉',
  '👇',
  '🤏',
  '✋',
  '👆',
  '🫳',
  '🫷',
  '🫸',
  '✍',
  '🤟',
  '🙏',
  '🤞',
  '🖕',
  '🫲',
  '👉🏼',
  '✌',
];

export const getRandomEmoji = () => em[Math.floor(Math.random() * em.length)];
