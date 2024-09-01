import { parseFile } from 'music-metadata';
import { getFileWithPath } from './utils.js';

export async function getAudioInfo(internalId: string) {
  try {
    const metadata = await parseFile(getFileWithPath(internalId));
    return {
      artist: metadata.common.artist,
      title: metadata.common.title,
      duration: metadata.format.duration,
    };
  } catch {
    return {};
  }
}
