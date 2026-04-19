import React from 'react';
import Svg, { Rect, Circle, Path, Line } from 'react-native-svg';
import { useTheme } from '@/lib/ThemeContext';

interface Props {
  index: 0 | 1 | 2;
  inverted?: boolean;
}

export function StoryIllustration({ index, inverted }: Props) {
  const t = useTheme();
  const stroke = inverted ? 'white' : t.text;
  const accent = inverted ? 'white' : t.primary;
  const dim = inverted ? 'rgba(255,255,255,0.4)' : t.textMute;
  const surfaceFill = inverted ? 'rgba(255,255,255,0.06)' : t.surface;

  if (index === 0) {
    return (
      <Svg width="260" height="180" viewBox="0 0 260 180" fill="none">
        <Rect x="20" y="20" width="80" height="140" rx="12" stroke={stroke} strokeWidth="1.5" />
        <Circle cx="60" cy="90" r="16" fill={accent} opacity={0.25} />
        <Circle cx="60" cy="90" r="7" fill={accent} />
        <Rect x="160" y="20" width="80" height="140" rx="12" stroke={stroke} strokeWidth="1.5" />
        <Circle cx="200" cy="90" r="16" fill={accent} opacity={0.25} />
        <Circle cx="200" cy="90" r="7" fill={accent} />
        <Path d="M108 90 Q 130 70, 152 90" stroke={accent} strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
        <Path d="M108 90 Q 130 110, 152 90" stroke={accent} strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
        <Circle cx="130" cy="90" r="3" fill={accent} />
      </Svg>
    );
  }
  if (index === 1) {
    return (
      <Svg width="260" height="180" viewBox="0 0 260 180" fill="none">
        <Rect
          x="50" y="30" width="70" height="110" rx="10"
          transform="rotate(-10 85 85)"
          stroke={stroke} strokeWidth="1.5" fill={surfaceFill}
        />
        <Rect
          x="140" y="35" width="70" height="110" rx="10"
          transform="rotate(8 175 90)"
          stroke={stroke} strokeWidth="1.5" fill={surfaceFill}
        />
        <Path d="M35 85 L20 95 L35 105" stroke={dim} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <Path d="M225 85 L240 95 L225 105" stroke={dim} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <Circle cx="85" cy="50" r="3" fill={accent} />
        <Circle cx="175" cy="55" r="3" fill={accent} />
      </Svg>
    );
  }
  const burstPoints = [0, 60, 120, 180, 240, 300].map((a) => {
    const r1 = 18, r2 = 28;
    const rad = (a * Math.PI) / 180;
    return {
      x1: 130 + Math.cos(rad) * r1,
      y1: 90 + Math.sin(rad) * r1,
      x2: 130 + Math.cos(rad) * r2,
      y2: 90 + Math.sin(rad) * r2,
    };
  });
  return (
    <Svg width="260" height="180" viewBox="0 0 260 180" fill="none">
      <Path d="M30 140 Q 80 40, 130 90" stroke={stroke} strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
      <Path d="M230 140 Q 180 40, 130 90" stroke={stroke} strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
      <Circle cx="30" cy="140" r="4" fill={stroke} />
      <Circle cx="230" cy="140" r="4" fill={stroke} />
      <Circle cx="130" cy="90" r="24" fill={accent} opacity={0.2} />
      <Circle cx="130" cy="90" r="10" fill={accent} />
      {burstPoints.map((p, i) => (
        <Line
          key={i}
          x1={p.x1}
          y1={p.y1}
          x2={p.x2}
          y2={p.y2}
          stroke={accent}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ))}
    </Svg>
  );
}
