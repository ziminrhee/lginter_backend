import { useEffect, useState } from 'react';

export default function useWeatherGreeting() {
  const [weatherGreeting, setWeatherGreeting] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    fetch('/api/weather', { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        clearTimeout(timeoutId);
        console.log('🌤️ Weather greeting:', data);
        setWeatherGreeting(data);
      })
      .catch(err => {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          console.log('⏱️ Weather API timeout - continuing without weather');
        } else {
          console.error('Weather API error:', err);
        }
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  return weatherGreeting;
}


