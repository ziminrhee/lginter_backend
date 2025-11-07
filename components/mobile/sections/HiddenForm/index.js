export default function HiddenForm({
  name,
  onNameChange,
  mood,
  onMoodChange
}) {
  return (
    <>
      <div style={{ display: 'none' }}>
        <label>이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="이름을 입력하세요"
        />
      </div>

      <div style={{ display: 'none' }}>
        <label>지금 기분</label>
        <input
          type="text"
          value={mood}
          onChange={(e) => onMoodChange(e.target.value)}
          placeholder="예: 행복해요, 설레요, 편안해요"
        />
      </div>

      <button
        type="submit"
        style={{ display: 'none' }}
      >
        입력 완료
      </button>
    </>
  );
}



