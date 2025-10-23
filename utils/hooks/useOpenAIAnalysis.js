import { useState } from "react";
import { createEmotionAnalysisRequest } from "@/utils/prompts/emotionAnalysis";

/**
 * OpenAI 감정 분석 및 환경 추천 훅
 * @param {Object} socket - Socket.io 클라이언트 인스턴스
 * @returns {Object} { loading, recommendations, analyze, reset }
 */
export default function useOpenAIAnalysis(socket) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const analyze = async (name, mood) => {
    setLoading(true);
    
    try {
      const requestBody = createEmotionAnalysisRequest(name, mood);
      
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (content) {
        // JSON 파싱
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          setRecommendations(result);
          
          // 서버로 사용자 니즈 전송 (우선순위 포함)
          if (socket) {
            socket.emit('user-needs', {
              userId: name,
              temperature: result.temperature,
              humidity: result.humidity,
              lightColor: result.lightColor,
              song: result.song,
              priority: result.priority || {
                temperature: 50,
                humidity: 50,
                light: 50,
                music: 50
              },
              timestamp: Date.now()
            });
            console.log('📤 Mobile: Sent user-needs with priority:', result.priority);
          }
        }
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setRecommendations(null);
    setLoading(false);
  };

  return {
    loading,
    recommendations,
    analyze,
    reset
  };
}

