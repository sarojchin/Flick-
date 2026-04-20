import React from 'react';
import { Pressable, Text } from 'react-native';
import { useTheme } from '@/lib/ThemeContext';
import { withAlpha } from '@/lib/theme';

interface Props {
  icon: string;
  color: string;
  onPress: () => void;
  big?: boolean;
  small?: boolean;
}

export function ActionButton({ icon, color, onPress, big, small }: Props) {
  const t = useTheme();
  const SZ = big ? 64 : small ? 48 : 56;
  const fs = big ? 28 : small ? 20 : 24;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: SZ,
        height: SZ,
        borderRadius: SZ / 2,
        backgroundColor: t.surface,
        borderWidth: 1.5,
        borderColor: color,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
        ...(pressed && { transform: [{ scale: 0.92 }] }),
      })}
    >
      <Text style={{ color, fontSize: fs, lineHeight: fs + 4, fontWeight: '500' }}>
        {icon}
      </Text>
    </Pressable>
  );
}
