import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useTheme } from '@/lib/ThemeContext';
import { withAlpha } from '@/lib/theme';
import { useRoom } from '@/lib/RoomState';
import { FLICK_MOODS, type Mood } from '@/lib/data';
import { ScreenHeader } from '@/components/ScreenHeader';
import { FlickButton } from '@/components/FlickButton';

export default function MoodScreen() {
  const t = useTheme();
  const router = useRouter();
  const { mood, setMood, profile } = useRoom();

  const isSolo = profile.mode === 'solo';
  const onNext = () => router.push(isSolo ? '/swipe' : '/services');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ paddingTop: 8 }}>
        <ScreenHeader onBack={() => router.back()} step={isSolo ? '01 / 01' : '01 / 03'} />
      </View>
      <View style={{ paddingHorizontal: 24, paddingTop: 20 }}>
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular',
            fontSize: 36,
            lineHeight: 38,
            color: t.text,
            letterSpacing: -0.8,
          }}
        >
          What's the{' '}
          <Text
            style={{
              fontFamily: 'InstrumentSerif_400Regular_Italic',
              color: t.primary,
            }}
          >
            mood
          </Text>
          ?
        </Text>
        <Text
          style={{
            color: t.textDim,
            fontSize: 14,
            marginTop: 10,
            fontFamily: 'Geist_400Regular',
          }}
        >
          We'll pre-load a stack of films that match.
        </Text>
      </View>

      <View
        style={{
          padding: 24,
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        {FLICK_MOODS.map((m) => {
          const on = mood === m.id;
          return (
            <Pressable
              key={m.id}
              onPress={() => setMood(m.id as Mood)}
              style={({ pressed }) => ({
                flexBasis: '48%',
                minHeight: 120,
                backgroundColor: on ? t.surface2 : t.surface,
                borderWidth: 1,
                borderColor: on ? t.primary : t.border,
                borderRadius: 18,
                padding: 16,
                justifyContent: 'space-between',
                shadowColor: t.primary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: on ? 0.35 : 0,
                shadowRadius: 16,
                elevation: on ? 6 : 0,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text
                style={{
                  fontFamily: 'InstrumentSerif_400Regular',
                  fontSize: 40,
                  lineHeight: 40,
                  color: on ? t.primary : t.textDim,
                }}
              >
                {m.glyph}
              </Text>
              <View>
                <Text
                  style={{
                    fontFamily: 'Geist_600SemiBold',
                    fontSize: 17,
                    color: t.text,
                    letterSpacing: -0.3,
                  }}
                >
                  {m.label}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Geist_400Regular',
                    fontSize: 12,
                    color: t.textMute,
                    marginTop: 3,
                  }}
                >
                  {m.sub}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <FlickButton onPress={onNext} disabled={!mood} size="lg" fullWidth>
          Continue  →
        </FlickButton>
      </View>
    </SafeAreaView>
  );
}
