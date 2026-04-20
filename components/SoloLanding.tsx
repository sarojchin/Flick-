import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useTheme } from '@/lib/ThemeContext';
import { withAlpha } from '@/lib/theme';
import { useRoom } from '@/lib/RoomState';
import { FLICK_MOVIES } from '@/lib/data';
import { FlickWordmark } from '@/components/FlickWordmark';
import { FlickPoster } from '@/components/FlickPoster';

function greetingFor(hour: number): string {
  if (hour < 5) return 'up late';
  if (hour < 12) return 'good morning';
  if (hour < 17) return 'good afternoon';
  return 'good evening';
}

export function SoloLanding() {
  const t = useTheme();
  const router = useRouter();
  const { profile, updateMode, resetRoom, regenerateRoom } = useRoom();

  const greet = greetingFor(new Date().getHours());
  const picks = [FLICK_MOVIES[2], FLICK_MOVIES[6], FLICK_MOVIES[9]];
  const rows = [
    { label: 'Because you liked sharp dramas', movies: FLICK_MOVIES.slice(0, 5) },
    { label: 'Short & sweet (under 100 min)', movies: FLICK_MOVIES.slice(3, 8) },
    { label: 'Critically adored', movies: FLICK_MOVIES.slice(5, 10) },
  ];

  const onSwipe = () => {
    resetRoom();
    router.push('/mood');
  };

  const onStartRoom = () => {
    updateMode('couple');
    resetRoom();
    regenerateRoom();
    router.push('/mood');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* top meta row */}
        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <FlickWordmark size={22} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 99,
                backgroundColor: t.surface,
                borderWidth: 1,
                borderColor: t.border,
              }}
            >
              <Text
                style={{
                  fontFamily: 'JetBrainsMono_400Regular',
                  fontSize: 9,
                  color: t.textDim,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                solo mode
              </Text>
            </View>
            <Pressable
              onPress={() => router.push('/settings')}
              hitSlop={10}
            >
              <Text style={{ fontSize: 22, color: t.textDim }}>⚙</Text>
            </Pressable>
          </View>
        </View>

        {/* greeting */}
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Text
            style={{
              fontFamily: 'JetBrainsMono_400Regular',
              fontSize: 10,
              color: t.textMute,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            {greet}
            {profile.name ? `, ${profile.name.toLowerCase()}` : ''}
          </Text>
          <Text
            style={{
              fontFamily: 'InstrumentSerif_400Regular',
              fontSize: 44,
              lineHeight: 44,
              letterSpacing: -1.2,
              marginTop: 6,
              color: t.text,
            }}
          >
            Something to{' '}
            <Text
              style={{
                fontFamily: 'InstrumentSerif_400Regular_Italic',
                color: t.primary,
              }}
            >
              watch
            </Text>
            .
          </Text>
        </View>

        {/* primary CTA: swipe for tonight */}
        <View style={{ paddingHorizontal: 20, paddingTop: 22 }}>
          <Pressable onPress={onSwipe}>
            <View
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                flexDirection: 'row',
                minHeight: 140,
                shadowColor: t.primary,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.2,
                shadowRadius: 20,
                elevation: 8,
              }}
            >
              <LinearGradient
                colors={[t.primary, t.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              />
              <View
                style={{
                  flex: 1,
                  padding: 18,
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <Text
                    style={{
                      fontFamily: 'JetBrainsMono_400Regular',
                      fontSize: 10,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                      color: withAlpha(t.bg, 0.7),
                    }}
                  >
                    for tonight
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'InstrumentSerif_400Regular',
                      fontSize: 26,
                      lineHeight: 28,
                      letterSpacing: -0.5,
                      marginTop: 6,
                      color: t.bg,
                    }}
                  >
                    Swipe to pick{'\n'}
                    <Text
                      style={{
                        fontFamily: 'InstrumentSerif_400Regular_Italic',
                      }}
                    >
                      a film.
                    </Text>
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: 'Geist_400Regular',
                    fontSize: 12,
                    color: withAlpha(t.bg, 0.75),
                    marginTop: 8,
                  }}
                >
                  Tuned to your mood →
                </Text>
              </View>
              <View style={{ width: 120, position: 'relative', overflow: 'hidden' }}>
                {picks.map((m, i) => (
                  <View
                    key={m.id}
                    style={{
                      position: 'absolute',
                      top: 14 + i * 4,
                      right: 12 - i * 14,
                      transform: [{ rotate: `${-6 + i * 5}deg` }],
                      zIndex: 3 - i,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.4,
                      shadowRadius: 14,
                      elevation: 4,
                    }}
                  >
                    <FlickPoster movie={m} size="sm" />
                  </View>
                ))}
              </View>
            </View>
          </Pressable>
        </View>

        {/* start-a-room callout */}
        <View style={{ paddingHorizontal: 20, paddingTop: 14 }}>
          <Pressable
            onPress={onStartRoom}
            style={{
              padding: 14,
              borderRadius: 16,
              backgroundColor: t.surface,
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: t.border,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: t.surface2,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: 'InstrumentSerif_400Regular',
                  fontSize: 22,
                  color: t.primary,
                }}
              >
                ◉
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: 'Geist_600SemiBold',
                  fontSize: 13,
                  color: t.text,
                }}
              >
                Watching with someone?
              </Text>
              <Text
                style={{
                  fontFamily: 'Geist_400Regular',
                  fontSize: 12,
                  color: t.textDim,
                  marginTop: 2,
                }}
              >
                Start a room → swipe together
              </Text>
            </View>
            <Text style={{ color: t.textMute, fontSize: 16 }}>→</Text>
          </Pressable>
        </View>

        {/* recommendation rows */}
        <View style={{ paddingTop: 24 }}>
          {rows.map((row, ri) => (
            <View key={ri} style={{ marginBottom: 22 }}>
              <View
                style={{
                  paddingHorizontal: 24,
                  paddingBottom: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'InstrumentSerif_400Regular',
                    fontSize: 20,
                    letterSpacing: -0.3,
                    color: t.text,
                  }}
                >
                  {row.label}
                </Text>
                <Text
                  style={{
                    fontFamily: 'JetBrainsMono_400Regular',
                    fontSize: 9,
                    color: t.textMute,
                    letterSpacing: 1,
                  }}
                >
                  SEE ALL
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}
              >
                {row.movies.map((m) => (
                  <View key={m.id} style={{ width: 110 }}>
                    <FlickPoster movie={m} size="sm" />
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: 'Geist_500Medium',
                        fontSize: 11,
                        color: t.text,
                        marginTop: 6,
                      }}
                    >
                      {m.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'JetBrainsMono_400Regular',
                        fontSize: 9,
                        color: t.textMute,
                        marginTop: 2,
                        letterSpacing: 1,
                      }}
                    >
                      {m.year} · {m.runtime}m
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
