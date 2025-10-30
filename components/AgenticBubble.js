import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export default function AgenticBubble({ styleType = 6, cameraMode = 'default' }) {
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      lightDir: { value: new THREE.Vector3(0.2, 0.9, 0.3).normalize() },
      ringDir: { value: new THREE.Vector3(0.08, 0.56, 0.86).normalize() },
      camY: { value: 0.0 },
      moveActive: { value: 0.0 },
      camZ: { value: 6.0 },
      zoomActive: { value: 0.0 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform float time;
      uniform vec3 lightDir;
      uniform vec3 ringDir;
      uniform float camY;       // 카메라 Y 위치
      uniform float moveActive; // 상하 이동 모드 활성화 여부 (0 or 1)
      uniform float camZ;       // 카메라 Z 위치
      uniform float zoomActive; // 줌 모드 활성화 여부 (0 or 1)
      varying vec2 vUv;
      varying vec3 vNormal;
      float hash(vec2 p){ p=fract(p*vec2(123.34,345.45)); p+=dot(p,p+34.345); return fract(p.x*p.y);}      
      float n2(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); float a=hash(i); float b=hash(i+vec2(1.0,0.0)); float c=hash(i+vec2(0.0,1.0)); float d=hash(i+vec2(1.0,1.0)); vec2 u=f*f*(3.0-2.0*f); return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);}      
      float noise(vec2 p) { return sin(p.x) * cos(p.y) + sin(p.x*2.0)*cos(p.y*2.0)*0.5; }
      float elasticWave(float x, float frequency, float amplitude){ float wave=sin(x*frequency)*amplitude; float decay=exp(-x*0.05); float bounce=sin(x*frequency*2.0)*amplitude*0.3; return (wave+bounce)*decay; }
      float breathingMotion(float time){ float slow=sin(time*0.3)*0.15; float fast=sin(time*0.8)*0.08; float deep=sin(time*0.15)*0.25; return slow+fast+deep; }
      float bumpMove(float c,float w,float f){ float d0=abs(f-(c-1.0)); float d1=abs(f-c); float d2=abs(f-(c+1.0)); float d=min(d0,min(d1,d2)); float aa=fwidth(f)*1.2; return smoothstep(w+aa,0.0+aa,d);}      
      vec3 bandWeights(float f){ float width=0.25; float y=bumpMove(0.18,width,f); float p=bumpMove(0.52,width,f); float u=bumpMove(0.86,width,f); return vec3(y,p,u);}      
      
      // 부드러운 블러 함수 추가
      float softBlur(float x, float strength) {
        return exp(-x * x / strength);
      }
      
      void main(){
        vec3 N=normalize(vNormal); vec3 L=normalize(lightDir); vec2 p=vUv-0.5; float r=length(p);
        float breathing=breathingMotion(time); r=r*(1.0+breathing*0.3);
        float topness=clamp(dot(N,normalize(ringDir))*0.5+0.5,0.0,1.0);
        vec3 colorPink=vec3(1.00,0.65,0.80); vec3 colorPeach=vec3(0.949,0.831,0.824); vec3 colorLavender=vec3(0.922,0.867,0.882); vec3 colorSky=vec3(0.847,0.851,0.902);
        vec3 base=colorPink;
        base=mix(base,colorPeach,smoothstep(0.20,0.55,1.0-topness)*0.65);
        base=mix(base,colorLavender,smoothstep(0.55,0.80,1.0-topness)*0.50);
        base=mix(base,colorSky,smoothstep(0.80,0.98,1.0-topness)*0.40);
        float loopSec=10.0; float loopT=mod(time,loopSec)/loopSec; float phase=-loopT;
        float ripple1=noise(vUv*3.0+time*0.5)*0.05; float ripple2=noise(vUv*5.0+time*0.3)*0.025; float ripple3=noise(vUv*7.0+time*0.7)*0.015; float totalRipple=ripple1+ripple2+ripple3;
        float elastic1=elasticWave(topness*2.0+time*0.4,3.0,0.08); float elastic2=elasticWave(topness*3.0+time*0.6,2.0,0.04); float totalElastic=elastic1+elastic2;
        float blurAmount=0.01; float f1=topness*1.8+phase+totalRipple+totalElastic; float f2=topness*1.8+phase+blurAmount+totalRipple*0.8+totalElastic*0.6; float f3=topness*1.8+phase+(blurAmount*1.5)+totalRipple*0.6+totalElastic*0.4;
        float perturb=0.01*n2(vUv*1.5+time*0.05); vec3 w1=bandWeights(f1+perturb); vec3 w2=bandWeights(f2+perturb*0.8); vec3 w3=bandWeights(f3+perturb*0.6);
        float wobble1=0.997+0.001*n2(vUv*2.2+time*0.06); float wobble2=0.997+0.001*n2(vUv*2.2+time*0.06+1.7); float wobble3=0.997+0.001*n2(vUv*2.2+time*0.06+3.1); w1*=wobble1; w2*=wobble2; w3*=wobble3;
        vec3 cY=vec3(0.949,0.831,0.824); vec3 cP=vec3(1.00,0.65,0.80); vec3 cU=vec3(0.847,0.851,0.902);
        float topMask=smoothstep(0.20,0.70,topness);
        w1*=vec3(1.0,1.0,0.80)*topMask; w2*=vec3(1.0,1.0,0.80)*topMask; w3*=vec3(0.75,0.85,1.0)*(1.0-topMask*0.5);
        vec3 flowColor1=cY*w1.x + cP*w1.y + cU*w1.z; vec3 flowColor2=cY*w2.x + cP*w2.y + cU*w2.z; vec3 flowColor3=cY*w3.x + cP*w3.y + cU*w3.z; vec3 flowColor=(0.5*flowColor1 + 0.35*flowColor2 + 0.15*flowColor3);
        float mask1=clamp(w1.x+w1.y+w1.z,0.0,1.0); float mask2=clamp(w2.x+w2.y+w2.z,0.0,1.0); float mask3=clamp(w3.x+w3.y+w3.z,0.0,1.0); float flowMaskAvg=clamp((0.5*mask1 + 0.35*mask2 + 0.15*mask3),0.0,1.0);
        vec3 lit=base; lit=mix(lit,flowColor,flowMaskAvg*0.55*topMask);
        vec3 rippleColor=vec3(1.00,0.65,0.80)*totalRipple*0.15*topMask; vec3 elasticColor=vec3(0.949,0.831,0.824)*totalElastic*0.12*topMask; lit+=rippleColor+elasticColor;
        
        // 프레넬과 글로우 효과 강화
        vec3 V=vec3(0.0,0.0,1.0); 
        float fres=pow(1.0 - max(dot(N,V),0.0), 3.0); // 프레넬 지수 감소로 더 부드럽게
        vec3 rimGlow=vec3(0.847,0.851,0.902)*fres*0.18 + vec3(0.90,0.88,0.93)*fres*0.15; // 림 글로우 하늘색-회색
        float softHalo=smoothstep(0.45, 0.1, r)*0.10; // 헤일로 효과 확대 및 강화
        vec3 glow=rimGlow + vec3(0.847,0.851,0.902)*softHalo*0.6 + vec3(0.90,0.88,0.93)*softHalo*0.4;
        lit+=glow;
        
        lit+=vec3(1.00,0.65,0.80)*(topness)*0.035*topMask + vec3(0.949,0.831,0.824)*(topness)*0.025*topMask;
        vec3 gray=vec3(dot(lit,vec3(0.299,0.587,0.114)));
        float loopPhase = 0.5 + 0.5 * sin(6.28318530718 * time / 7.0);
        float sat = 1.12 + 0.06 * loopPhase;
        lit = mix(gray, lit, sat);
        float brightness = 1.10 + 0.04 * loopPhase;
        lit *= brightness;
        float contrast = 1.08 + 0.08 * loopPhase;
        lit = (lit - 0.5) * contrast + 0.5;
        lit=pow(lit,vec3(0.86)); lit*=1.0; lit=clamp(lit,0.0,1.0);
        
        // 외곽 블러 효과 강화
        float edgeBase = smoothstep(0.68, 0.22, r); // 더 넓은 범위의 기본 페더링
        float edgeGlow = softBlur(r - 0.30, 0.28); // 부드러운 글로우 추가
        float edgeFeather = edgeBase * (1.0 + edgeGlow * 0.5);
        
        // 알파 값 조정 (외곽 블러 강화)
        float alpha = 0.88 * edgeFeather + fres * 0.15;  // 기본 알파값을 높임
        alpha = alpha * (1.0 - softBlur(r - 0.35, 0.32) * 0.3); // 외곽 블러 효과 강화
        alpha = clamp(alpha, 0.0, 0.95);  // 최대 알파값 증가
        
        gl_FragColor=vec4(lit,alpha);
      }
    `,
    transparent: true,
  }), [])

  // 스프링 상태 저장 (속도)
  const zVelocityRef = useRef(0)
  const yVelocityRef = useRef(0)

  useFrame((state, delta) => {
    material.uniforms.time.value += delta
    
    // 카메라 애니메이션 처리 (스프링 기반, 미세 진동)
    const { camera } = state
    const time = state.clock.getElapsedTime()
    const dt = Math.min(delta, 0.05)

    const baseZ = 6 // Canvas 기본 카메라 z와 동기화
    const baseY = 0

    // 더 넓은 진폭과 개선된 스프링 애니메이션
    const periodZoom = 8 // 초 (더 빠른 주기)
    const periodMove = 8 // 초 (더 빠른 주기)
    const ampZ = 2.0 // z 진폭 (더 강하게)
    const ampY = 0.8 // y 진폭 (더 강하게)

    // 스프링 기반 타겟 계산 (빠르게 들어가고 천천히 나오는 이징)
    let targetZ = baseZ
    let targetY = baseY

    if (cameraMode === 'zoom') {
      const t = (time / periodZoom) % 1.0
      // 빠르게 들어가고 천천히 나오는 이징 함수
      const easedT = t < 0.5 
        ? 2 * t * t // 빠르게 들어가기 (0~0.5)
        : 1 - 2 * (1 - t) * (1 - t) // 천천히 나오기 (0.5~1)
      targetZ = baseZ + Math.sin(easedT * Math.PI * 2) * ampZ
    }

    if (cameraMode === 'move') {
      const t = (time / periodMove) % 1.0
      // 빠르게 들어가고 천천히 나오는 이징 함수
      const easedT = t < 0.5 
        ? 2 * t * t // 빠르게 들어가기 (0~0.5)
        : 1 - 2 * (1 - t) * (1 - t) // 천천히 나오기 (0.5~1)
      targetY = baseY + Math.sin(easedT * Math.PI * 2) * ampY
    }

    // 스프링 파라미터 (더 반응적인 스프링)
    const stiffnessZ = 12.0
    const stiffnessY = 12.0
    const damping = 0.75 // 더 강한 감쇠로 자연스러운 움직임

    // Z 축 스프링 업데이트
    const currentZ = camera.position.z
    const accZ = (targetZ - currentZ) * stiffnessZ
    zVelocityRef.current += accZ * dt
    zVelocityRef.current *= damping
    const newZ = currentZ + zVelocityRef.current * dt

    // Y 축 스프링 업데이트
    const currentY = camera.position.y
    const accY = (targetY - currentY) * stiffnessY
    yVelocityRef.current += accY * dt
    yVelocityRef.current *= damping
    const newY = currentY + yVelocityRef.current * dt

    camera.position.set(0, newY, newZ)

    // 셰이더로 현재 카메라 Y와 이동 모드 전달
    material.uniforms.camY.value = newY
    material.uniforms.moveActive.value = cameraMode === 'move' ? 1.0 : 0.0
    material.uniforms.camZ.value = newZ
    material.uniforms.zoomActive.value = cameraMode === 'zoom' ? 1.0 : 0.0
  })

  const meshRef = useRef()
  const { camera, viewport } = useThree()
  const v = viewport.getCurrentViewport(camera, [0, 0, 0])
  
  // /mobile 페이지인지 확인
  const isMobilePage = typeof window !== 'undefined' && window.location.pathname === '/mobile'
  
  // 모바일에서는 더 큰 크기와 잘린 위치로 설정
  const radius = Math.min(v.width, v.height) * (isMobilePage ? 0.55 : 0.33) // 모바일에서 크기 확실히 줄임
  const margin = v.height * (isMobilePage ? 0.01 : 0.035)
  
  // 모바일에서는 스피어가 좌우 하단이 잘리도록 위치 조정
  let yBottom = -v.height / 2 + radius + margin
  if (isMobilePage) {
    yBottom = -v.height / 2 + radius * 1.5 // 위치 확실히 위로
  }

  return (
    <>
      <mesh ref={meshRef} position={[0, yBottom, 0]}>
        <sphereGeometry args={[radius, 256, 256]} />
        <primitive object={material} attach="material" />
      </mesh>
    </>
  )
}

