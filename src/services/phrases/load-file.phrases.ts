const phrases = [
  'Uploading the downloaded file to Telegram.',
  'Subiendo el archivo descargado a Telegram.',
  'En train de télécharger le fichier téléchargé sur Telegram.',
  'Lade die heruntergeladene Datei auf Telegram hoch.',
  'Caricando il file scaricato su Telegram.',
  '正在将下载的文件上传到 Telegram。',
  'ダウンロードしたファイルをテレグラムにアップロードしています。',
  'Carregando o arquivo baixado para o Telegram.',
  'يتم تحميل الملف المحمّل إلى تلغرام.',
  '다운로드한 파일을 텔레그램에 업로드 중입니다.',
];

function getRandom(list: string[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export function getLoadPh() {
  return getRandom(phrases);
}
