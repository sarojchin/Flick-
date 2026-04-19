import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/lib/ThemeContext';

interface Props {
  onBack: () => void;
  step?: string;
  right?: React.ReactNode;
}

export function ScreenHeader({ onBack, step, right }: Props) {
  const t = useTheme();
  return (
    <View
      style={{
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Pressable
        onPress={onBack}
        style={({ pressed }) => ({
          width: 36,
          height: 36,
          borderRadius: 12,
          backgroundColor: t.surface,
          borderWidth: 1,
          borderColor: t.border,
          alignItems: 'center',
          justifyContent: 'center',
          transform: pressed ? [{ scale: 0.93 }] : undefined,
        })}
      >
        <Svg width="14" height="14" viewBox="0 0 14 14">
          <Path
            d="M9 2L3.5 7L9 12"
            stroke={t.text}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </Pressable>
      <Text
        style={{
          fontFamily: 'JetBrainsMono_400Regular',
          fontSize: 11,
          color: t.textMute,
          letterSpacing: 1,
        }}
      >
        {step ?? ''}
      </Text>
      <View style={{ width: 36, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}
