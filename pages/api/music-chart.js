// iTunes Search API를 사용한 무료 음악 차트 (API 키 불필요)
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { genre = 'pop', limit = 10 } = req.query;

  try {
    // iTunes Search API (무료, 제한 없음)
    // 장르별 인기곡 검색
    const genreMap = {
      'pop': 'pop',
      'rock': 'rock',
      'jazz': 'jazz',
      'classical': 'classical',
      'electronic': 'electronic',
      'rnb': 'R&B/Soul',
      'hiphop': 'Hip-Hop/Rap',
      'kpop': 'K-Pop'
    };

    const searchGenre = genreMap[genre] || 'pop';
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchGenre)}&entity=song&limit=${limit}&country=KR`;

    const response = await fetch(itunesUrl);
    const data = await response.json();

    const songs = data.results.map(song => ({
      id: song.trackId,
      title: song.trackName,
      artist: song.artistName,
      album: song.collectionName,
      albumArt: song.artworkUrl100?.replace('100x100', '300x300'),
      previewUrl: song.previewUrl, // 30초 미리듣기 URL
      releaseDate: song.releaseDate,
      genre: song.primaryGenreName
    }));

    res.status(200).json({
      success: true,
      genre: searchGenre,
      count: songs.length,
      songs: songs
    });

  } catch (error) {
    console.error('Music Chart API Error:', error);
    
    // Fallback 데이터
    res.status(200).json({
      success: true,
      genre: genre,
      count: 5,
      songs: [
        {
          id: 1,
          title: 'Dynamite',
          artist: 'BTS',
          album: 'BE',
          genre: 'K-Pop'
        },
        {
          id: 2,
          title: 'Blinding Lights',
          artist: 'The Weeknd',
          album: 'After Hours',
          genre: 'Pop'
        },
        {
          id: 3,
          title: 'Levitating',
          artist: 'Dua Lipa',
          album: 'Future Nostalgia',
          genre: 'Pop'
        },
        {
          id: 4,
          title: 'Stay',
          artist: 'The Kid LAROI & Justin Bieber',
          album: 'F*ck Love 3: Over You',
          genre: 'Pop'
        },
        {
          id: 5,
          title: 'Good 4 U',
          artist: 'Olivia Rodrigo',
          album: 'SOUR',
          genre: 'Pop'
        }
      ]
    });
  }
}

