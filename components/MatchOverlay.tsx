import React from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/lib/ThemeContext';
import { withAlpha } from '@/lib/theme';
import { FLICK_SERVICES, type Movie } from '@/lib/data';
import { FlickPoster } from './FlickPoster';
import { FlickButton } from './FlickButton';

interface Props {
  movie: Movie;
  onClose: () => void;
  onOpenMatches: () => void;
}

export function MatchOverlay({ movie, onClose, onOpenMatches }: Props) {
  const t = useTheme();
  const services = FLICK_SERVICES.filter((s) => movie.services.includes(s.id));
  const endHour = Math.floor(21 + movie.runtime / 60);
  const endMin = String(movie.runtime % 60).padStart(2, '0');
  const providers = movie.providers ?? [];

  const openProvider = (deepLink: string | undefined, name: string) => {
    const url = deepLink ?? `https://www.google.com/search?q=${encodeURIComponent(`watch ${movie.title} on ${name}`)}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: t.bg,
        zIndex: 100,
      }}
    >
      {/* glow backdrop */}
      <LinearGradient
        colors={[withAlpha(t.primary, 0.2), 'transparent']}
        start={{ x: 0.5, y: 0.1 }}
        end={{ x: 0.5, y: 0.7 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <View style={{ paddingTop: 70, paddingHorizontal: 24, alignItems: 'center' }}>
        <Animated.Text
          entering={FadeInUp.delay(200).duration(500)}
          style={{
            fontFamily: 'JetBrainsMono_400Regular',
            fontSize: 11,
            color: t.primary,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          — you both said yes —
        </Animated.Text>
        <Animated.Text
          entering={FadeInUp.delay(300).duration(600)}
          style={{
            fontFamily: 'InstrumentSerif_400Regular',
            fontSize: 56,
            lineHeight: 56,
            color: t.text,
            letterSpacing: -1.5,
            marginTop: 14,
            textAlign: 'center',
          }}
        >
          It's a{' '}
          <Text
            style={{
              fontFamily: 'InstrumentSerif_400Regular_Italic',
              color: t.primary,
            }}
          >
            match
          </Text>
          .
        </Animated.Text>
      </View>

      <Animated.View
        entering={ZoomIn.delay(300).duration(700)}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FlickPoster movie={movie} size="lg" />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(550).duration(600)}
        style={{
          marginHorizontal: 20,
          marginBottom: 20,
          padding: 20,
          borderRadius: 20,
          backgroundColor: t.surface,
          borderWidth: 1,
          borderColor: t.border,
        }}
      >
        <Text
          style={{
            fontFamily: 'JetBrainsMono_400Regular',
            fontSize: 10,
            color: t.textMute,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          Tonight's plan
        </Text>
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular',
            fontSize: 26,
            marginTop: 4,
            lineHeight: 29,
            letterSpacing: -0.4,
            color: t.text,
          }}
        >
          {movie.title}
        </Text>
        {movie.runtime > 0 && (
          <Text
            style={{
              fontFamily: 'Geist_400Regular',
              fontSize: 13,
              color: t.textDim,
              marginTop: 10,
            }}
          >
            🕗 {movie.runtime}m · ends by {endHour}:{endMin}
          </Text>
        )}

        {providers.length === 0 ? (
          <Text
            style={{
              fontFamily: 'Geist_400Regular',
              fontSize: 12,
              color: t.textMute,
              marginTop: 14,
            }}
          >
            Not currently streaming on the services we track.
          </Text>
        ) : (
          <View style={{ marginTop: 14 }}>
            <Text
              style={{
                fontFamily: 'JetBrainsMono_400Regular',
                fontSize: 10,
                color: t.textMute,
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              OPEN ON
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {providers.map((p) => {
                // Match against our internal service to inherit tint + mono.
                const internal = FLICK_SERVICES.find(
                  (s) => s.name.toLowerCase() === p.name.toLowerCase()
                );
                return (
                  <Pressable
                    key={p.name}
                    onPress={() => openProvider(p.deepLink, p.name)}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      paddingVertical: 6,
                      paddingLeft: 6,
                      paddingRight: 12,
                      borderRadius: 999,
                      backgroundColor: t.surface2,
                      borderWidth: 1,
                      borderColor: t.border,
                      opacity: pressed ? 0.85 : 1,
                    })}
                  >
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 5,
                        backgroundColor: internal?.tint ?? t.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'InstrumentSerif_400Regular',
                          fontSize: 13,
                          color: 'white',
                        }}
                      >
                        {internal?.mono ?? p.name[0]}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: 'Geist_500Medium',
                        fontSize: 13,
                        color: t.text,
                      }}
                    >
                      {p.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'JetBrainsMono_400Regular',
                        fontSize: 11,
                        color: t.textMute,
                      }}
                    >
                      ↗
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* If we don't have providers yet (still enriching) but know which
            services list this title, show their tags as a teaser. */}
        {providers.length === 0 && services.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              marginTop: 12,
              flexWrap: 'wrap',
            }}
          >
            <Text
              style={{
                fontFamily: 'JetBrainsMono_400Regular',
                fontSize: 10,
                color: t.textMute,
                letterSpacing: 1,
              }}
            >
              ON
            </Text>
            {services.map((s) => (
              <View
                key={s.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingVertical: 4,
                  paddingLeft: 4,
                  paddingRight: 10,
                  borderRadius: 999,
                  backgroundColor: t.surface2,
                  borderWidth: 1,
                  borderColor: t.border,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    backgroundColor: s.tint,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'InstrumentSerif_400Regular',
                      fontSize: 12,
                      color: 'white',
                    }}
                  >
                    {s.mono}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: 'Geist_500Medium',
                    fontSize: 12,
                    color: t.text,
                  }}
                >
                  {s.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(700).duration(500)}
        style={{
          paddingHorizontal: 20,
          paddingBottom: 40,
          flexDirection: 'row',
          gap: 10,
        }}
      >
        <FlickButton variant="surface" onPress={onClose} size="md" style={{ flex: 1 }}>
          Keep swiping
        </FlickButton>
        <FlickButton onPress={onOpenMatches} size="md" style={{ flex: 1.5 }}>
          See matches →
        </FlickButton>
      </Animated.View>
    </Animated.View>
  );
}
