import ytdl from 'ytdl-core';

interface Env {
  YOUTUBE_API_KEY: string;
}

export async function onRequest(context: { request: Request; env: Env }) {
  try {
    const { url } = await context.request.json();
    const videoId = extractVideoId(url);

    if (!videoId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid YouTube URL'
        }),
        { status: 400 }
      );
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${context.env.YOUTUBE_API_KEY}&part=snippet,contentDetails`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Video not found'
        }),
        { status: 404 }
      );
    }

    const video = data.items[0];
    const formats = [
      {
        formatId: 'mp4_720p',
        quality: '720p',
        extension: 'mp4',
        filesize: 0,
        downloadUrl: `https://www.youtube.com/watch?v=${videoId}`
      }
    ];

    return new Response(
      JSON.stringify({
        success: true,
        formats,
        videoInfo: {
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.high.url,
          duration: video.contentDetails.duration,
          author: video.snippet.channelTitle
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

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
} 