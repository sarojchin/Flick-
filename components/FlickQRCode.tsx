import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useTheme } from '@/lib/ThemeContext';

interface Props {
  value: string;
  size?: number;
}

// Deterministic hash → 25x25 cell grid, ported verbatim from the prototype
function buildCells(value: string): boolean[] {
  const N = 25;
  const hash = (s: string, salt: number) => {
    let h = salt;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return h;
  };
  const grid: boolean[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      grid.push(((hash(value, x * 7 + y * 13) >>> 0) % 100) < 48);
    }
  }
  const setBlock = (cx: number, cy: number) => {
    for (let dy = 0; dy < 7; dy++) {
      for (let dx = 0; dx < 7; dx++) {
        const x = cx + dx, y = cy + dy;
        if (x < 0 || x >= N || y < 0 || y >= N) continue;
        const ring = (dx === 0 || dx === 6 || dy === 0 || dy === 6);
        const center = (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
        grid[y * N + x] = ring || center;
      }
    }
  };
  setBlock(0, 0);
  setBlock(N - 7, 0);
  setBlock(0, N - 7);
  return grid;
}

export function FlickQRCode({ value, size = 200 }: Props) {
  const t = useTheme();
  const N = 25;
  const cells = useMemo(() => buildCells(value), [value]);
  const inner = size - 24;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 14,
        padding: 12,
        backgroundColor: t.text,
        shadowColor: t.primary,
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.2,
        shadowRadius: 40,
        elevation: 10,
      }}
    >
      <Svg width={inner} height={inner} viewBox={`0 0 ${N} ${N}`}>
        {cells.map((on, i) => {
          if (!on) return null;
          const x = i % N;
          const y = Math.floor(i / N);
          return <Rect key={i} x={x} y={y} width={1.05} height={1.05} fill={t.bg} />;
        })}
      </Svg>
      <View
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginLeft: -(size * 0.11),
          marginTop: -(size * 0.11),
          width: size * 0.22,
          height: size * 0.22,
          borderRadius: 6,
          backgroundColor: t.bg,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular',
            fontSize: size * 0.11,
            color: t.text,
          }}
        >
          F
        </Text>
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular_Italic',
            fontSize: size * 0.11,
            color: t.primary,
          }}
        >
          !
        </Text>
      </View>
    </View>
  );
}
