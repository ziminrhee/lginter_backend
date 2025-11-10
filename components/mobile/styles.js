import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

export const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const GradientCard = styled.div`
  background: linear-gradient(135deg, #F3E8FF 0%, #FCEAFE 100%);
  border-radius: 15px;
  padding: 1.5rem;
  animation: slideInUp 0.5s ease-out;
`;

export const CardTitle = styled.h3`
  color: #9333EA;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
`;

export const MetricEmoji = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

export const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #9333EA;
`;

export const MetricLabel = styled.div`
  font-size: 0.85rem;
  color: #9333EA;
  opacity: 0.7;
  margin-top: 0.25rem;
`;

export const ColorCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

export const ColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const ColorSwatch = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
`;

export const ColorMeta = styled.div`
  flex: 1;
`;

export const ColorLabel = styled.div`
  font-size: 0.85rem;
  color: #9333EA;
  opacity: 0.7;
  margin-bottom: 0.25rem;
`;

export const ColorValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #9333EA;
`;

export const MusicCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 12px;
`;

export const MusicLabel = styled.div`
  font-size: 0.85rem;
  color: #9333EA;
  opacity: 0.7;
  margin-bottom: 0.5rem;
`;

export const MusicValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #9333EA;
`;

export const PrimaryButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%);
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(147, 51, 234, 0.3);
`;

export const SuccessPanel = styled.div`
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #F3E8FF 0%, #FCEAFE 100%);
  border-radius: 15px;
`;

export const SuccessEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export const SuccessText = styled.p`
  color: #9333EA;
  font-size: 1.2rem;
  font-weight: 600;
`;


