// YouTube Data API를 사용한 음악 검색 (재생 가능한 비디오 ID 반환)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { song, artist } = req.body;

  if (!song) {
    return res.status(400).json({ error: 'Song name is required' });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    
    if (!apiKey || apiKey === 'your_youtube_api_key_here') {
      // API 키가 없으면 일반 YouTube 검색 URL만 반환
      const searchQuery = encodeURIComponent(`${song} ${artist || ''} official audio`);
      return res.status(200).json({
        success: true,
        hasApiKey: false,
        searchUrl: `https://www.youtube.com/results?search_query=${searchQuery}`,
        song: song,
        artist: artist || 'Unknown',
        message: 'YouTube API key not configured. Returning search URL only.'
      });
    }

    // YouTube Data API v3로 검색
    const searchQuery = encodeURIComponent(`${song} ${artist || ''} official audio`);
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&maxResults=1&key=${apiKey}`;

    const response = await fetch(youtubeUrl);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      const videoId = video.id.videoId;

      res.status(200).json({
        success: true,
        hasApiKey: true,
        videoId: videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url,
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`,
        watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
        song: song,
        artist: artist || 'Unknown'
      });
    } else {
      throw new Error('No video found');
    }

  } catch (error) {
    console.error('YouTube Search API Error:', error);
    
    // Fallback: 일반 검색 URL 반환
    const searchQuery = encodeURIComponent(`${song} ${artist || ''} official audio`);
    res.status(200).json({
      success: true,
      hasApiKey: false,
      searchUrl: `https://www.youtube.com/results?search_query=${searchQuery}`,
      song: song,
      artist: artist || 'Unknown',
      error: error.message
    });
  }
}

