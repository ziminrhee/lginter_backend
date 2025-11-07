export function createSocketHandlers({ setClimateData, setParticipantCount }) {
  const onDeviceDecision = (data) => {
    const seenUsers = new Set();
    if (data.device === 'sw1') {
      setClimateData({ temperature: data.temperature, humidity: data.humidity });
      if (data.assignedUsers) {
        Object.values(data.assignedUsers).forEach((u) => {
          if (u && u !== 'N/A') seenUsers.add(String(u));
        });
        setParticipantCount(seenUsers.size);
      }
    }
  };

  return { onDeviceDecision };
}


