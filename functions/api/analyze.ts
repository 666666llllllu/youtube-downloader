import { createYtDlp } from 'yt-dlp-wasm';

interface Env {
  YOUTUBE_API_KEY: string;
}

export async function onRequest(context: { request: Request; env: Env }) {
  try {
    const { url } = await context.request.json();

    if (!isValidYouTubeUrl(url)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid YouTube URL'
        }),
        { status: 400 }
      );
    }

    const ytDlp = await createYtDlp();
    const videoInfo = await ytDlp.getVideoInfo(url);

    const formats = videoInfo.formats
      .filter(format => format.filesize && format.quality)
      .map(format => ({
        formatId: format.format_id,
        quality: format.quality,
        extension: format.ext,
        filesize: format.filesize,
        downloadUrl: format.url
      }));

    return new Response(
      JSON.stringify({
        success: true,
        formats,
        videoInfo: {
          title: videoInfo.title,
          thumbnail: videoInfo.thumbnail,
          duration: formatDuration(videoInfo.duration),
          author: videoInfo.uploader
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to analyze video'
      }),
      { status: 500 }
    );
  }
}

function isValidYouTubeUrl(url: string): boolean {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
} 