import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/lib/ThemeContext';
import { withAlpha } from '@/lib/theme';
import type { Service } from '@/lib/data';

interface Props {
  service: Service;
  selected: boolean;
  onPress: () => void;
  size?: 'sm' | 'md';
}

export function FlickServiceChip({ service, selected, onPress, size = 'md' }: Props) {
  const t = useTheme();
  const innerBox = size === 'sm' ? 16 : 28;
  const chipFs = size === 'sm' ? 12 : 14;
  const monoFs = size === 'sm' ? 13 : 18;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: size === 'sm' ? 6 : 10,
        paddingVertical: size === 'sm' ? 6 : 8,
        paddingLeft: size === 'sm' ? 6 : 8,
        paddingRight: size === 'sm' ? 10 : 14,
        borderRadius: 999,
        backgroundColor: selected ? t.surface2 : 'transparent',
        borderWidth: 1,
        borderColor: selected ? t.primary : t.border,
        opacity: pressed ? 0.85 : 1,
        shadowColor: t.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: selected ? 0.35 : 0,
        shadowRadius: 12,
        elevation: selected ? 6 : 0,
      })}
    >
      <View
        style={{
          width: innerBox,
          height: innerBox,
          borderRadius: 6,
          backgroundColor: service.tint,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular',
            fontSize: monoFs,
            color: 'white',
          }}
        >
          {service.mono}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: 'Geist_500Medium',
          fontSize: chipFs,
          color: selected ? t.text : t.textDim,
        }}
      >
        {service.name}
      </Text>
    </Pressable>
  );
}
