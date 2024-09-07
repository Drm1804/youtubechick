import ytdl from '@distube/ytdl-core';

export async function getAudioInfo(url: string) {
  try {
    const metadata = await ytdl.getBasicInfo(url);

    return {
      artist: metadata.videoDetails.ownerChannelName,
      title: metadata.videoDetails.title,
      duration: Number(metadata.videoDetails.lengthSeconds),
    };
  } catch {
    return {};
  }
}
