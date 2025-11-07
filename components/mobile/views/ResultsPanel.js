import * as UI from '../styles';

export default function ResultsPanel({ name, recommendations, onReset }) {
  if (!recommendations) return null;
  return (
    <UI.ResultsContainer>
      <UI.GradientCard>
        <UI.CardTitle>🎯 {(name || '사용자')}님을 위한 추천</UI.CardTitle>
        <UI.MetricsGrid>
          <UI.MetricCard>
            <UI.MetricEmoji>🌡️</UI.MetricEmoji>
            <UI.MetricValue>{recommendations.temperature}°C</UI.MetricValue>
            <UI.MetricLabel>온도</UI.MetricLabel>
          </UI.MetricCard>
          <UI.MetricCard>
            <UI.MetricEmoji>💧</UI.MetricEmoji>
            <UI.MetricValue>{recommendations.humidity}%</UI.MetricValue>
            <UI.MetricLabel>습도</UI.MetricLabel>
          </UI.MetricCard>
        </UI.MetricsGrid>
        <UI.ColorCard>
          <UI.ColorRow>
            <UI.ColorSwatch style={{ background: recommendations.lightColor }} />
            <UI.ColorMeta>
              <UI.ColorLabel>💡 조명 색상</UI.ColorLabel>
              <UI.ColorValue>{recommendations.lightColor}</UI.ColorValue>
            </UI.ColorMeta>
          </UI.ColorRow>
        </UI.ColorCard>
        <UI.MusicCard>
          <UI.MusicLabel>🎵 추천 음악</UI.MusicLabel>
          <UI.MusicValue>{recommendations.song}</UI.MusicValue>
        </UI.MusicCard>
      </UI.GradientCard>
      <UI.PrimaryButton onClick={onReset}>다시 입력하기</UI.PrimaryButton>
    </UI.ResultsContainer>
  );
}


