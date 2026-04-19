import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/lib/ThemeContext';

interface Props {
  children?: React.ReactNode;
}

export function MiniPhone({ children }: Props) {
  const t = useTheme();
  return (
    <View
      style={{
        width: 110,
        height: 180,
        borderRadius: 18,
        backgroundColor: t.bg2,
        borderWidth: 1.5,
        borderColor: t.border,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 30,
        elevation: 8,
      }}
    >
      {children}
    </View>
  );
}
