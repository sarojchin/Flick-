import React from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/lib/ThemeContext';
import { withAlpha } from '@/lib/theme';

type Variant = 'primary' | 'ghost' | 'surface';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}

export function FlickButton({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  style,
  fullWidth,
}: Props) {
  const t = useTheme();
  const sizes = {
    sm: { py: 10, px: 16, fs: 14 },
    md: { py: 14, px: 20, fs: 15 },
    lg: { py: 18, px: 28, fs: 17 },
  }[size];
  const content = (
    <Text
      style={{
        fontFamily: 'Geist_600SemiBold',
        fontSize: sizes.fs,
        color: variant === 'primary' ? 'white' : t.text,
        letterSpacing: -0.1,
      }}
    >
      {children}
    </Text>
  );

  const base: ViewStyle = {
    borderRadius: 14,
    paddingVertical: sizes.py,
    paddingHorizontal: sizes.px,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.4 : 1,
    width: fullWidth ? '100%' : undefined,
  };

  if (variant === 'primary') {
    return (
      <Pressable
        onPress={disabled ? undefined : onPress}
        style={({ pressed }) => [
          {
            borderRadius: 14,
            width: fullWidth ? '100%' : undefined,
            ...(pressed && { transform: [{ scale: 0.97 }] }),
            opacity: disabled ? 0.4 : 1,
            shadowColor: t.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 24,
            elevation: 8,
          },
          style,
        ]}
      >
        <LinearGradient
          colors={[t.primary, t.primary2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[base, { borderWidth: 1, borderColor: t.primary }]}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  if (variant === 'ghost') {
    return (
      <Pressable
        onPress={disabled ? undefined : onPress}
        style={({ pressed }) => [
          base,
          {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: t.border,
            ...(pressed && { transform: [{ scale: 0.97 }] }),
          },
          style,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        base,
        {
          backgroundColor: t.surface,
          borderWidth: 1,
          borderColor: t.border,
          ...(pressed && { transform: [{ scale: 0.97 }] }),
        },
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}
