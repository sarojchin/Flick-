import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
  interpolate,
  Extrapolation,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/lib/ThemeContext';
import { withAlpha } from '@/lib/theme';
import { FLICK_SERVICES, type Movie } from '@/lib/data';

interface Props {
  movie: Movie;
  dx?: SharedValue<number>;
  dy?: SharedValue<number>;
  detailsOpen?: boolean;
}

export const SWIPE_CARD_W = 340;
export const SWIPE_CARD_H = 500;

const PANEL_HEIGHT = 300;

function renderStars(rating: number) {
  // rating is 0..100; map to 0..5 in 0.5 steps
  const s5 = Math.max(0, Math.min(5, Math.round((rating / 100) * 10) / 2));
  const full = Math.floor(s5);
  const half = s5 - full >= 0.5;
  const glyphs: string[] = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) glyphs.push('★');
    else if (i === full && half) glyphs.push('★');
    else glyphs.push('☆');
  }
  return glyphs.join('');
}

export function SwipeCard({ movie, dx, dy, detailsOpen = false }: Props) {
  const t = useTheme();
  const services = FLICK_SERVICES.filter((s) => movie.services.includes(s.id));
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = !!movie.posterUrl && !imgFailed;

  const panelProgress = useSharedValue(detailsOpen ? 1 : 0);
  useEffect(() => {
    panelProgress.value = withTiming(detailsOpen ? 1 : 0, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
  }, [detailsOpen, panelProgress]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          panelProgress.value,
          [0, 1],
          [PANEL_HEIGHT, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  // Fade the compact poster-view title strip as panel rises
  const posterBottomStyle = useAnimatedStyle(() => ({
    opacity: interpolate(panelProgress.value, [0, 0.6], [1, 0], Extrapolation.CLAMP),
  }));

  const yesStyle = useAnimatedStyle(() => {
    if (!dx || !dy) return { opacity: 0 };
    const verticalLead = dy.value < 0 && Math.abs(dy.value) > Math.abs(dx.value);
    return {
      opacity: verticalLead
        ? 0
        : interpolate(dx.value, [0, 100], [0, 1], Extrapolation.CLAMP),
    };
  });
  const noStyle = useAnimatedStyle(() => {
    if (!dx || !dy) return { opacity: 0 };
    const verticalLead = dy.value < 0 && Math.abs(dy.value) > Math.abs(dx.value);
    return {
      opacity: verticalLead
        ? 0
        : interpolate(-dx.value, [0, 100], [0, 1], Extrapolation.CLAMP),
    };
  });
  const maybeStyle = useAnimatedStyle(() => {
    if (!dx || !dy) return { opacity: 0 };
    const verticalLead = dy.value < 0 && Math.abs(dy.value) > Math.abs(dx.value);
    const o = verticalLead
      ? interpolate(-dy.value, [0, 120], [0, 1], Extrapolation.CLAMP)
      : 0;
    return {
      opacity: o,
      transform: [
        { translateX: -55 },
        { rotate: '-2deg' },
        { scale: 0.9 + o * 0.2 },
      ],
    };
  });

  const stars = renderStars(movie.rating);
  const ratingOutOfTen = (movie.rating / 10).toFixed(1);

  return (
    <View
      style={{
        width: SWIPE_CARD_W,
        height: SWIPE_CARD_H,
        borderRadius: 26,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 30 },
        shadowOpacity: 0.5,
        shadowRadius: 60,
        elevation: 20,
      }}
    >
      <LinearGradient
        colors={[movie.gradient[0], movie.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      {showImage && (
        <Image
          source={{ uri: movie.posterUrl }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          contentFit="cover"
          transition={200}
          onError={() => setImgFailed(true)}
        />
      )}
      {/* top highlight */}
      <LinearGradient
        colors={['rgba(255,255,255,0.15)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      {/* bottom shade for the compact title strip */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.75)']}
        start={{ x: 0.5, y: 0.55 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Top: code + info button */}
      <View
        style={{
          position: 'absolute',
          top: 16,
          left: 18,
          right: 18,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Text
          style={{
            fontFamily: 'JetBrainsMono_400Regular',
            fontSize: 10,
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: 1,
          }}
        >
          {movie.code}
        </Text>
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: 'rgba(0,0,0,0.45)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.25)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: 'InstrumentSerif_400Regular_Italic',
              fontSize: 18,
              color: 'white',
              lineHeight: 20,
              marginTop: -1,
            }}
          >
            {detailsOpen ? '×' : 'i'}
          </Text>
        </View>
      </View>

      {/* Poster-view compact title strip */}
      <Animated.View
        style={[
          { position: 'absolute', bottom: 20, left: 20, right: 20 },
          posterBottomStyle,
        ]}
        pointerEvents="none"
      >
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular',
            fontSize: 28,
            lineHeight: 30,
            color: 'white',
            letterSpacing: -0.6,
          }}
          numberOfLines={2}
        >
          {movie.title}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginTop: 6,
          }}
        >
          {[movie.year.toString(), movie.runtime > 0 ? `${movie.runtime}m` : null, movie.genres.join(' / ')]
            .filter((s): s is string => !!s)
            .map((s, i, arr) => (
              <React.Fragment key={s + i}>
                <Text
                  style={{
                    fontFamily: 'Geist_400Regular',
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.85)',
                  }}
                >
                  {s}
                </Text>
                {i < arr.length - 1 && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.5)',
                      marginHorizontal: 6,
                    }}
                  >
                    ·
                  </Text>
                )}
              </React.Fragment>
            ))}
        </View>
      </Animated.View>

      {/* Details panel — slides up from the bottom */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: PANEL_HEIGHT,
            backgroundColor: 'rgba(8,10,14,0.86)',
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.12)',
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 18,
          },
          panelStyle,
        ]}
        pointerEvents={detailsOpen ? 'auto' : 'none'}
      >
        <View
          style={{
            alignSelf: 'center',
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.25)',
            marginBottom: 12,
          }}
        />
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular',
            fontSize: 30,
            lineHeight: 32,
            color: 'white',
            letterSpacing: -0.6,
          }}
          numberOfLines={2}
        >
          {movie.title}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginTop: 4,
          }}
        >
          {[movie.year.toString(), movie.runtime > 0 ? `${movie.runtime}m` : null, movie.genres.join(' / ')]
            .filter((s): s is string => !!s)
            .map((s, i, arr) => (
              <React.Fragment key={s + i}>
                <Text
                  style={{
                    fontFamily: 'Geist_400Regular',
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.8)',
                  }}
                >
                  {s}
                </Text>
                {i < arr.length - 1 && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.4)',
                      marginHorizontal: 6,
                    }}
                  >
                    ·
                  </Text>
                )}
              </React.Fragment>
            ))}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontFamily: 'InstrumentSerif_400Regular',
              fontSize: 16,
              color: t.accent,
              letterSpacing: 2,
            }}
          >
            {stars}
          </Text>
          <Text
            style={{
              fontFamily: 'JetBrainsMono_400Regular',
              fontSize: 11,
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            {ratingOutOfTen}/10
          </Text>
        </View>

        <Text
          style={{
            fontFamily: 'Geist_400Regular',
            fontSize: 13,
            color: 'rgba(255,255,255,0.92)',
            lineHeight: 18,
            marginTop: 12,
          }}
          numberOfLines={6}
        >
          {movie.synopsis}
        </Text>

        {movie.cast.length > 0 && (
          <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'baseline' }}>
            <Text
              style={{
                fontFamily: 'JetBrainsMono_400Regular',
                fontSize: 9,
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: 1,
                textTransform: 'uppercase',
                marginRight: 8,
              }}
            >
              Cast
            </Text>
            <Text
              style={{
                flex: 1,
                fontFamily: 'Geist_400Regular',
                fontSize: 12,
                color: 'rgba(255,255,255,0.85)',
              }}
              numberOfLines={1}
            >
              {movie.cast.join(' · ')}
            </Text>
          </View>
        )}

        {services.length > 0 && (
          <View
            style={{
              marginTop: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Text
              style={{
                fontFamily: 'JetBrainsMono_400Regular',
                fontSize: 9,
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              On
            </Text>
            {services.map((s) => (
              <View
                key={s.id}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 5,
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
            ))}
          </View>
        )}
      </Animated.View>

      {/* YES / NO / MAYBE stamps (unchanged) */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 70,
            left: 20,
            transform: [{ rotate: '-16deg' }],
            borderWidth: 4,
            borderColor: t.yes,
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 18,
          },
          yesStyle,
        ]}
        pointerEvents="none"
      >
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular_Italic',
            fontSize: 38,
            color: t.yes,
            letterSpacing: 1,
            textShadowColor: withAlpha(t.yes, 0.5),
            textShadowRadius: 12,
            textShadowOffset: { width: 0, height: 0 },
          }}
        >
          yes
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 70,
            right: 20,
            transform: [{ rotate: '16deg' }],
            borderWidth: 4,
            borderColor: t.no,
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 18,
          },
          noStyle,
        ]}
        pointerEvents="none"
      >
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular_Italic',
            fontSize: 38,
            color: t.no,
            letterSpacing: 1,
            textShadowColor: withAlpha(t.no, 0.5),
            textShadowRadius: 12,
            textShadowOffset: { width: 0, height: 0 },
          }}
        >
          nope
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 40,
            left: '50%',
            borderWidth: 4,
            borderColor: t.accent,
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 24,
          },
          maybeStyle,
        ]}
        pointerEvents="none"
      >
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular_Italic',
            fontSize: 38,
            color: t.accent,
            letterSpacing: 1,
            textShadowColor: withAlpha(t.accent, 0.5),
            textShadowRadius: 12,
            textShadowOffset: { width: 0, height: 0 },
          }}
        >
          maybe
        </Text>
      </Animated.View>
    </View>
  );
}
