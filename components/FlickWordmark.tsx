import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@/lib/ThemeContext';

interface Props {
  size?: number;
}

export function FlickWordmark({ size = 22 }: Props) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
      <Text
        style={{
          fontFamily: 'InstrumentSerif_400Regular',
          fontSize: size,
          color: t.text,
          letterSpacing: -0.5,
        }}
      >
        Flick
      </Text>
      <Text
        style={{
          fontFamily: 'InstrumentSerif_400Regular_Italic',
          fontSize: size,
          color: t.primary,
          letterSpacing: -0.5,
        }}
      >
        !
      </Text>
    </View>
  );
}
