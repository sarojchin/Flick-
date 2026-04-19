import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/lib/ThemeContext';

interface Props {
  count: number;
  active: number;
}

export function ProgressDots({ count, active }: Props) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 4, flex: 1, maxWidth: 160 }}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            height: 3,
            flex: 1,
            borderRadius: 99,
            backgroundColor: i <= active ? t.primary : t.border,
          }}
        />
      ))}
    </View>
  );
}
