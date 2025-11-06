import { container as containerStyle, circleWrap, text as textStyle } from '../modules/voice/orchestrating.styles';

export default function OrchestratingScreen() {

  return (
    <div style={containerStyle()}>
      <div style={circleWrap()}>
        <div style={textStyle}>ORCHESTRATING</div>
      </div>
    </div>
  );
}


