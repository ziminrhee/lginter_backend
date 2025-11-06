import { useEffect, useMemo, useState } from 'react';

export function useTextRotation(env){
  const [idx,setIdx] = useState(0);
  useEffect(()=>{
    const id = setInterval(()=> setIdx(i=> (i+1)%2), 5000);
    return ()=> clearInterval(id);
  },[]);
  const data = useMemo(()=>({
    panels: [
      { // music
        value: env?.music ?? '',
        reason: env?.reasons?.music?.[idx] ?? '',
        typing: env?.inputs?.music?.[idx] ?? '',
      },
      { // humidity
        value: `${env?.humidity ?? ''}%`,
        reason: env?.reasons?.humidity?.[idx] ?? '',
        typing: env?.inputs?.humidity?.[idx] ?? '',
      },
      { // temp
        value: `${env?.temp ?? ''}°C`,
        reason: env?.reasons?.temp?.[idx] ?? '',
        typing: env?.inputs?.temp?.[idx] ?? '',
      },
      { // light
        value: 'Yellow Light',
        reason: env?.reasons?.light?.[idx] ?? '',
        typing: env?.inputs?.light?.[idx] ?? '',
      },
    ]
  }),[env, idx]);
  return data;
}


