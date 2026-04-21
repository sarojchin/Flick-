import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useTheme } from '@/lib/ThemeContext';
import { withAlpha } from '@/lib/theme';
import { FLICK_SERVICES, type Movie } from '@/lib/data';

interface Props {
  movie: Movie;
  dx?: SharedValue<number>;
  dy?: SharedValue<number>;
}

export const SWIPE_CARD_W = 340;
export const SWIPE_CARD_H = 500;

export function SwipeCard({ movie, dx, dy }: Props) {
  const t = useTheme();
  const services = FLICK_SERVICES.filter((s) => movie.services.includes(s.id));
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = !!movie.posterUrl && !imgFailed;

  useEffect(() => {
    setImgFailed(false);
  }, [movie.id]);

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
          transition={0}
          cachePolicy="memory-disk"
          recyclingKey={movie.id}
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
      {/* bottom shade */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        start={{ x: 0.5, y: 0.35 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Top: code + rating */}
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
            backgroundColor: 'rgba(0,0,0,0.35)',
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 6,
          }}
        >
          <Text
            style={{
              fontFamily: 'JetBrainsMono_400Regular',
              fontSize: 11,
              color: 'white',
            }}
          >
            ★ {movie.rating}%
          </Text>
        </View>
      </View>

      {/* Big title */}
      <View style={{ position: 'absolute', bottom: 150, left: 20, right: 20 }}>
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular',
            fontSize: 44,
            lineHeight: 44,
            color: 'white',
            letterSpacing: -1,
          }}
        >
          {movie.title}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          {[movie.year.toString(), `${movie.runtime}m`, movie.genres.join(' / ')].map(
            (s, i, arr) => (
              <React.Fragment key={s}>
                <Text
                  style={{
                    fontFamily: 'Geist_400Regular',
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.85)',
                  }}
                >
                  {s}
                </Text>
                {i < arr.length - 1 && (
                  <Text
                    style={{
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.5)',
                      marginHorizontal: 6,
                    }}
                  >
                    ·
                  </Text>
                )}
              </React.Fragment>
            )
          )}
        </View>
      </View>

      {/* Synopsis + services */}
      <View style={{ position: 'absolute', bottom: 18, left: 20, right: 20 }}>
        <Text
          style={{
            fontFamily: 'Geist_400Regular',
            fontSize: 13,
            color: 'rgba(255,255,255,0.92)',
            lineHeight: 18,
            marginBottom: 12,
          }}
        >
          {movie.synopsis}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text
            style={{
              fontFamily: 'JetBrainsMono_400Regular',
              fontSize: 9,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            ON
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
      </View>

      {/* YES / NO stamps */}
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
