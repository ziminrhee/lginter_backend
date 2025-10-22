// OpenWeatherMap API를 사용한 날씨 정보, 시간대별 인사말
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // OpenWeatherMap API (무료), 근데 api키 아직 안넣음, 하드코딩 상태임

    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'demo';
    const city = 'Seoul';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=kr`;

    let weatherData = null;
    let weatherDescription = '맑음';
    let temperature = 20;

    // API 키가 있으면 실제 날씨 데이터 가져오기
    if (apiKey !== 'demo') {
      try {
        const weatherResponse = await fetch(weatherUrl);
        if (weatherResponse.ok) {
          weatherData = await weatherResponse.json();
          weatherDescription = weatherData.weather[0].description;
          temperature = Math.round(weatherData.main.temp);
        }
      } catch (error) {
        console.log('Weather API fallback to demo data');
      }
    }

    // 현재 시간 (한국 시간)
    const now = new Date();
    const koreaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    const hour = koreaTime.getHours();

    // 시간대별 인사말
    let timeGreeting = '';
    if (hour >= 5 && hour < 12) {
      timeGreeting = '좋은 아침이에요';
    } else if (hour >= 12 && hour < 18) {
      timeGreeting = '좋은 오후에요';
    } else if (hour >= 18 && hour < 22) {
      timeGreeting = '좋은 저녁이에요';
    } else {
      timeGreeting = '늦은 밤이네요';
    }

    // 날씨 기반 추가 멘트
    let weatherComment = '';
    if (weatherDescription.includes('비') || weatherDescription.includes('rain')) {
      weatherComment = '비가 오고 있어요. 우산 챙기셨나요? ☔';
    } else if (weatherDescription.includes('눈') || weatherDescription.includes('snow')) {
      weatherComment = '눈이 내리고 있어요. 따뜻하게 입으세요! ⛄';
    } else if (weatherDescription.includes('구름') || weatherDescription.includes('cloud')) {
      weatherComment = '구름이 있는 날씨네요. ☁️';
    } else if (weatherDescription.includes('맑') || weatherDescription.includes('clear')) {
      weatherComment = '맑은 날씨예요! ☀️';
    } else {
      weatherComment = '오늘도 좋은 하루 되세요! 😊';
    }

    // 온도 기반 코멘트
    let tempComment = '';
    if (temperature >= 28) {
      tempComment = '더운 날씨네요!';
    } else if (temperature >= 20) {
      tempComment = '쾌적한 날씨예요.';
    } else if (temperature >= 10) {
      tempComment = '선선한 날씨네요.';
    } else {
      tempComment = '추운 날씨예요!';
    }

    res.status(200).json({
      greeting: timeGreeting,
      weather: weatherDescription,
      temperature: temperature,
      weatherComment: weatherComment,
      tempComment: tempComment,
      fullGreeting: `${timeGreeting}! 서울은 지금 ${temperature}°C, ${weatherDescription}. ${tempComment} ${weatherComment}`,
      timestamp: koreaTime.toISOString()
    });

  } catch (error) {
    console.error('Weather API Error:', error);
    
    // Fallback 응답
    const hour = new Date().getHours();
    let timeGreeting = '안녕하세요';
    if (hour >= 5 && hour < 12) timeGreeting = '좋은 아침이에요';
    else if (hour >= 12 && hour < 18) timeGreeting = '좋은 오후에요';
    else if (hour >= 18 && hour < 22) timeGreeting = '좋은 저녁이에요';

    res.status(200).json({
      greeting: timeGreeting,
      weather: '맑음',
      temperature: 20,
      weatherComment: '좋은 하루 되세요! 😊',
      tempComment: '쾌적한 날씨예요.',
      fullGreeting: `${timeGreeting}! 오늘도 좋은 하루 되세요! 😊`,
      timestamp: new Date().toISOString()
    });
  }
}

