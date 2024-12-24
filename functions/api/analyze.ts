import ytdl from 'ytdl-core';

interface Env {
  YOUTUBE_API_KEY: string;
}

export async function onRequest(context: { request: Request; env: Env }) {
  try {
    const { url } = await context.request.json();

    if (!ytdl.validateURL(url)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid YouTube URL'
        }),
        { status: 400 }
      );
    }

    const info = await ytdl.getInfo(url);
    
    const formats = info.formats
      .filter(format => format.hasVideo && format.hasAudio)
      .map(format => ({
        formatId: format.itag,
        quality: format.qualityLabel,
        extension: 'mp4',
        filesize: parseInt(format.contentLength) || 0,
        downloadUrl: format.url
      }));

    return new Response(
      JSON.stringify({
        success: true,
        formats,
        videoInfo: {
          title: info.videoDetails.title,
          thumbnail: info.videoDetails.thumbnails[0].url,
          duration: formatDuration(parseInt(info.videoDetails.lengthSeconds)),
          author: info.videoDetails.author.name
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

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
} 