import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import { useTheme } from '@/lib/ThemeContext';
import { withAlpha } from '@/lib/theme';
import { useRoom } from '@/lib/RoomState';
import { FLICK_MOVIES } from '@/lib/data';
import { FlickWordmark } from '@/components/FlickWordmark';
import { FlickStatusDot } from '@/components/FlickStatusDot';
import { FlickButton } from '@/components/FlickButton';
import { FlickPoster } from '@/components/FlickPoster';

const HERO_POSTERS = [
  { movie: FLICK_MOVIES[1], x: -110, y: 20, rot: -12, z: 1, delay: 0 },
  { movie: FLICK_MOVIES[5], x: 10,   y: -30, rot: 4,   z: 3, delay: 300 },
  { movie: FLICK_MOVIES[7], x: 110,  y: 30,  rot: 14,  z: 1, delay: 600 },
];

function FloatingPoster({ p }: { p: typeof HERO_POSTERS[number] }) {
  const offset = useSharedValue(0);
  useEffect(() => {
    offset.value = withDelay(
      p.delay,
      withRepeat(
        withTiming(-10, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  const aStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: p.x },
      { translateY: p.y + offset.value },
      { rotate: `${p.rot}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        { position: 'absolute', left: '50%', top: '50%', marginLeft: -110, marginTop: -165, zIndex: p.z },
        aStyle,
      ]}
    >
      <FlickPoster movie={p.movie} size="md" />
    </Animated.View>
  );
}

export default function Landing() {
  const t = useTheme();
  const router = useRouter();
  const { regenerateRoom, resetRoom, profile } = useRoom();

  const onStart = () => {
    resetRoom();
    regenerateRoom();
    router.push('/mood');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <LinearGradient
        colors={[withAlpha(t.primary, 0.15), 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <FlickWordmark size={26} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <FlickStatusDot live label="couples mode" />
          <Pressable
            onPress={() => router.push('/settings')}
            hitSlop={10}
          >
            <Text style={{ fontSize: 22, color: t.textDim }}>⚙</Text>
          </Pressable>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
        }}
      >
        <View style={{ width: 340, height: 340, position: 'relative' }}>
          {HERO_POSTERS.map((p, i) => (
            <FloatingPoster key={i} p={p} />
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: 24 }}>
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular',
            fontSize: 52,
            lineHeight: 50,
            color: t.text,
            letterSpacing: -1.5,
            textAlign: 'center',
          }}
        >
          Tonight,{'\n'}
          <Text
            style={{
              fontFamily: 'InstrumentSerif_400Regular_Italic',
              color: t.primary,
            }}
          >
            pick together.
          </Text>
        </Text>
        <Text
          style={{
            marginTop: 14,
            fontFamily: 'Geist_400Regular',
            fontSize: 15,
            color: t.textDim,
            lineHeight: 22,
            textAlign: 'center',
            paddingHorizontal: 20,
          }}
        >
          {profile.name ? `Welcome back, ${profile.name}. ` : ''}
          Swipe films side-by-side. When you both say yes, it's movie night.
        </Text>
      </View>

      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 28,
          paddingBottom: 20,
          gap: 10,
        }}
      >
        <FlickButton onPress={onStart} size="lg" fullWidth>
          Start a room  →
        </FlickButton>
        <Pressable
          onPress={() => router.push('/join')}
          style={{ paddingVertical: 10 }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Geist_400Regular',
              fontSize: 13,
              color: t.textMute,
            }}
          >
            Already have a code?{' '}
            <Text style={{ color: t.text, textDecorationLine: 'underline' }}>Join</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
