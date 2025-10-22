/**
 * 감정 분석 및 환경 추천을 위한 OpenAI 프롬프트
 */

export const EMOTION_ANALYSIS_SYSTEM_PROMPT = `당신은 감정 분석 전문가입니다. 사용자의 감정 상태를 분석하여 최적의 환경 설정을 추천합니다.

응답은 반드시 다음 JSON 형식으로만 제공하세요:
{
  "temperature": 숫자(18-28 범위),
  "humidity": 숫자(40-60 범위),
  "lightColor": "#RRGGBB" 형식의 색상 코드,
  "song": "노래 제목 - 아티스트",
  "reason": "추천 이유를 한 문단으로 설명",
  "priority": {
    "temperature": 숫자(0-100, 온도 조절의 중요도 %),
    "humidity": 숫자(0-100, 습도 조절의 중요도 %),
    "light": 숫자(0-100, 조명 조절의 중요도 %),
    "music": 숫자(0-100, 음악의 중요도 %)
  }
}

**중요: 음악은 반드시 저작권이 없는 로열티 프리(Royalty Free) 음원만 추천하세요.**
추천 가능한 음악:
- YouTube Audio Library의 무료 음원
- Creative Commons 라이선스 음악
- Kevin MacLeod, Bensound, Incompetech 등의 무료 음악
- 클래식 음악 (퍼블릭 도메인)
- 앰비언트/네이처 사운드

priority는 사용자의 감정 상태에서 각 환경 요소가 얼마나 중요한지를 나타냅니다.
예: 더운 감정(화남, 답답함) → temperature priority 높음
예: 우울한 감정 → music priority 높음
예: 불안한 감정 → light priority 높음`;

/**
 * 사용자별 감정 분석 요청 프롬프트 생성
 * @param {string} name - 사용자 이름
 * @param {string} mood - 사용자 기분/감정
 * @returns {string} 프롬프트 문자열
 */
export function createEmotionAnalysisPrompt(name, mood) {
  return `사용자 ${name}님의 현재 기분: "${mood}"

이 감정에 맞는 온도, 습도, 조명 색깔, 노래를 추천하고 이유를 설명해주세요.`;
}

/**
 * OpenAI API 요청을 위한 전체 메시지 구성
 * @param {string} name - 사용자 이름
 * @param {string} mood - 사용자 기분/감정
 * @param {string} model - 사용할 모델 (기본값: 'gpt-4o-mini')
 * @returns {Object} OpenAI API 요청 객체
 */
export function createEmotionAnalysisRequest(name, mood, model = 'gpt-4o-mini') {
  return {
    model,
    messages: [
      {
        role: 'system',
        content: EMOTION_ANALYSIS_SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: createEmotionAnalysisPrompt(name, mood)
      }
    ]
  };
}

