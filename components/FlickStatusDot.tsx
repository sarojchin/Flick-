import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useTheme } from '@/lib/ThemeContext';

interface Props {
  live?: boolean;
  color?: string;
  label: string;
}

export function FlickStatusDot({ live, color, label }: Props) {
  const t = useTheme();
  const opacity = useSharedValue(1);
  const dotColor = color ?? (live ? t.yes : t.textMute);

  useEffect(() => {
    if (live) {
      opacity.value = withRepeat(
        withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      cancelAnimation(opacity);
      opacity.value = 1;
    }
    return () => cancelAnimation(opacity);
  }, [live, opacity]);

  const aStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
      <Animated.View
        style={[
          {
            width: 7,
            height: 7,
            borderRadius: 99,
            backgroundColor: dotColor,
            shadowColor: dotColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: live ? 0.9 : 0,
            shadowRadius: 8,
            elevation: live ? 4 : 0,
          },
          aStyle,
        ]}
      />
      <Text
        style={{
          fontFamily: 'JetBrainsMono_400Regular',
          fontSize: 11,
          color: t.textDim,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
    </View>
  );
}
