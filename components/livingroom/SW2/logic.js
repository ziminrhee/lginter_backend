export function createSocketHandlers({ setAmbienceData, setAssignedUsers, searchYouTubeMusic }) {
  const onDeviceDecision = (data) => {
    console.log('💡 SW2 received device-decision:', data);
    if (data.device === 'sw2') {
      console.log('✅ SW2: Data matched, updating state');
      setAmbienceData(data);
      if (data.assignedUsers) {
        setAssignedUsers(data.assignedUsers);
        console.log('👥 SW2: Assigned users:', data.assignedUsers);
      }
      if (data.song) {
        searchYouTubeMusic(data.song);
      }
    } else {
      console.log('⏭️ SW2: Data not for this device, skipping');
    }
  };

  const onDeviceNewDecision = (msg) => {
    if (!msg || (msg.target && msg.target !== 'sw2')) return;
    const env = msg.env || {};
    const data = { device: 'sw2', lightColor: env.lightColor, song: env.music };
    setAmbienceData(prev => ({ ...prev, ...data }));
  };

  return { onDeviceDecision, onDeviceNewDecision };
}


