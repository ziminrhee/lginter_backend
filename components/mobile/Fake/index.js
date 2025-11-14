import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import useSocketMobile from "@/utils/hooks/useSocketMobile";

const DEFAULT_USERS = [
  { userId: "M1", name: "사용자1" },
  { userId: "M2", name: "사용자2" },
  { userId: "M3", name: "사용자3" },
];

export default function FakeMobile() {
  const [users, setUsers] = useState(() =>
    DEFAULT_USERS.map((u) => ({
      ...u,
      mood: "",
      lastDecision: null,
      initialized: false,
      isSending: false,
    }))
  );

  const { socket, emitNewName, emitNewVoice } = useSocketMobile({
    onMobileDecision: (payload) => {
      const assignedUser = payload?.userId || payload?.meta?.userId;
      if (!assignedUser) return;
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === assignedUser
            ? { ...u, lastDecision: payload, isSending: false }
            : u
        )
      );
    },
  });

  const ensureInitForUser = (userId) => {
    setUsers((prev) =>
      prev.map((u) => (u.userId === userId ? { ...u, initialized: true } : u))
    );
    try {
      socket?.emit("mobile-init", { userId });
    } catch {}
  };

  const handleChange = (userId, field, value) => {
    setUsers((prev) =>
      prev.map((u) => (u.userId === userId ? { ...u, [field]: value } : u))
    );
  };

  const handleSend = async (user) => {
    const trimmedName = (user.name || "").trim();
    const trimmedMood = (user.mood || "").trim();
    if (!trimmedMood) return;

    if (!user.initialized) {
      ensureInitForUser(user.userId);
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.userId === user.userId ? { ...u, isSending: true } : u
      )
    );

    const effectiveName = trimmedName || user.userId;
    try {
      emitNewName(effectiveName, { userId: user.userId });
    } catch {}
    try {
      emitNewVoice(trimmedMood, trimmedMood, 0.8, {
        userId: user.userId,
        name: effectiveName,
      });
    } catch {}
  };

  const handleBroadcast = () => {
    users.forEach((u) => {
      if (u.mood?.trim()) handleSend(u);
    });
  };

  return (
    <Wrap>
      <Header>테스트용 모바일 (가짜 입력)</Header>
      <Desc>텍스트만 입력해 전체 디바이스 오케스트레이션을 트리거합니다.</Desc>

      <Grid>
        {users.map((u) => {
          const decisionSummary = summarizeDecision(u.lastDecision);
          return (
            <Card key={u.userId}>
              <Title>{u.userId}</Title>
              <Field>
                <Label>이름</Label>
                <Input
                  type="text"
                  placeholder={`${u.userId} (선택사항)`}
                  value={u.name}
                  onChange={(e) => handleChange(u.userId, "name", e.target.value)}
                />
              </Field>
              <Field>
                <Label>기분 / 텍스트</Label>
                <Input
                  type="text"
                  placeholder="예: 차분하고 포근한 분위기"
                  value={u.mood}
                  onChange={(e) => handleChange(u.userId, "mood", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend(u);
                  }}
                />
              </Field>
              <Row>
                <Button onClick={() => handleSend(u)} disabled={!u.mood?.trim() || u.isSending}>
                  {u.isSending ? "전송 중..." : "전송"}
                </Button>
                <InitBadge $active={u.initialized}>
                  {u.initialized ? "INIT됨" : "미INIT"}
                </InitBadge>
              </Row>
              <DecisionBox>
                <DecisionTitle>결과 요약</DecisionTitle>
                <DecisionText>
                  {decisionSummary || "아직 결과 없음"}
                </DecisionText>
              </DecisionBox>
            </Card>
          );
        })}
      </Grid>

      <FooterRow>
        <ButtonPrimary onClick={handleBroadcast}>모두 전송</ButtonPrimary>
        <Small>엔터키로 개별 전송 가능</Small>
      </FooterRow>
    </Wrap>
  );
}

function summarizeDecision(payload) {
  if (!payload) return null;
  const p = payload?.params || payload?.assignments || payload;
  const t =
    p?.temp ?? p?.temperature ?? payload?.temperature ?? payload?.temp;
  const h =
    p?.humidity ?? payload?.humidity;
  const c =
    p?.lightColor ?? p?.light ?? payload?.light ?? payload?.lightColor;
  const m =
    p?.music ?? payload?.song ?? payload?.music;
  const r = payload?.reason || payload?.meta?.reason;

  const parts = [];
  if (t != null) parts.push(`온도: ${t}°C`);
  if (h != null) parts.push(`습도: ${h}%`);
  if (c) parts.push(`조명: ${String(c)}`);
  if (m) parts.push(`음악: ${m}`);

  const main = parts.length ? parts.join(" / ") : null;
  if (main && r) return `${main}\n이유: ${r}`;
  if (main) return main;
  if (r) return `이유: ${r}`;
  return null;
}

const Wrap = styled.div`
  min-height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  padding: 24px;
  background: #0b0b12;
  color: #f3f3f7;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.h1`
  font-size: 20px;
  margin: 0;
`;

const Desc = styled.p`
  margin: 0 0 8px 0;
  color: #9aa3b2;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  width: 100%;
`;

const Card = styled.div`
  background: #141420;
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.div`
  font-weight: 700;
  color: #c6c8ff;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 12px;
  color: #9aa3b2;
`;

const Input = styled.input`
  background: #0e0e18;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  color: #f3f3f7;
  padding: 10px 12px;
  outline: none;
  font-size: 14px;
  transition: border 120ms ease;
  &:focus {
    border-color: #7c3aed;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #7c3aed, #ec4899);
  border: none;
  color: #fff;
  padding: 10px 14px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 120ms ease, opacity 120ms ease;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  &:active {
    transform: translateY(1px);
  }
`;

const ButtonPrimary = styled(Button)`
  padding: 12px 18px;
`;

const InitBadge = styled.span`
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #2a2a3a;
  background: ${(p) => (p.$active ? "#10281d" : "#2a1b1b")};
  color: ${(p) => (p.$active ? "#67e8a5" : "#e98a8a")};
`;

const DecisionBox = styled.div`
  border: 1px dashed #2a2a3a;
  border-radius: 8px;
  padding: 10px;
  min-height: 64px;
  background: #0e0e18;
`;

const DecisionTitle = styled.div`
  font-size: 12px;
  color: #9aa3b2;
  margin-bottom: 4px;
`;

const DecisionText = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
  color: #dfe3f0;
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
`;

const Small = styled.span`
  color: #9aa3b2;
  font-size: 12px;
`;


