// Pure merge/normalize utils for Controller
import { DEFAULT_ENV } from '../stateStore';
import { normalizeTemperature, normalizeWindLevel } from '@/utils/policies/temperature.policy';
import { normalizeHumidity, decidePurifierSettings } from '@/utils/policies/humidity.policy';
import { normalizeLightColor } from '@/utils/policies/lightColor.policy';
import { normalizeMusic } from '@/utils/policies/music.policy';

export function normalizeEnv(params, emotionHint, context = {}) {
  if (!params) return { ...DEFAULT_ENV };
  const temp = normalizeTemperature(params.temp, context);
  const humidity = normalizeHumidity(params.humidity, emotionHint);
  const windLevel = normalizeWindLevel(params.windLevel, emotionHint);
  const softTone = /부드럽|편안|휴식|따뜻/.test(String(emotionHint || ''));
  const lightColor = normalizeLightColor(params.lightColor, { soft: softTone });
  const music = normalizeMusic(params.music, emotionHint);
  const purifier = decidePurifierSettings(humidity, emotionHint);
  return { temp, humidity, windLevel, lightColor, music, ...purifier };
}

export function computeFairAverage(entries) {
  if (!entries.length) return { ...DEFAULT_ENV };

  const temps = entries.map((entry) => entry.params.temp ?? DEFAULT_ENV.temp);
  const humidities = entries.map((entry) => entry.params.humidity ?? DEFAULT_ENV.humidity);
  const colors = entries.map((entry) => entry.params.lightColor || DEFAULT_ENV.lightColor);
  const musicVotes = entries.map((entry) => entry.params.music || DEFAULT_ENV.music);

  const avgTemp = Math.round(temps.reduce((acc, value) => acc + value, 0) / temps.length);
  const avgHumidity = Math.round(humidities.reduce((acc, value) => acc + value, 0) / humidities.length);
  const avgColor = averageColors(colors);
  const music = majorityVote(musicVotes, DEFAULT_ENV.music);

  return { temp: avgTemp, humidity: avgHumidity, lightColor: avgColor, music };
}

function averageColors(colors) {
  if (!colors.length) return DEFAULT_ENV.lightColor;
  const rgbs = colors.map(hexToRgb);
  const avgR = Math.round(rgbs.reduce((sum, c) => sum + c.r, 0) / rgbs.length);
  const avgG = Math.round(rgbs.reduce((sum, c) => sum + c.g, 0) / rgbs.length);
  const avgB = Math.round(rgbs.reduce((sum, c) => sum + c.b, 0) / rgbs.length);
  return rgbToHex(avgR, avgG, avgB);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
}

function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function majorityVote(items, fallback) {
  if (!items.length) return fallback;
  const counts = {};
  items.forEach((item) => {
    counts[item] = (counts[item] || 0) + 1;
  });
  let winner = fallback;
  let maxCount = 0;
  Object.entries(counts).forEach(([key, count]) => {
    if (count > maxCount) {
      maxCount = count;
      winner = key;
    }
  });
  return winner;
}


