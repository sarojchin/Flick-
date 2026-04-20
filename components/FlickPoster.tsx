import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Defs, Pattern, Circle as SvgCircle } from 'react-native-svg';
import type { Movie } from '@/lib/data';

type Size = 'sm' | 'md' | 'lg';

interface Props {
  movie: Movie;
  size?: Size;
  tilt?: number;
}

export function FlickPoster({ movie, size = 'md', tilt = 0 }: Props) {
  const W = { sm: 60, md: 220, lg: 300 }[size];
  const H = Math.round(W * 1.5);
  const titleSize = { sm: 9, md: 22, lg: 30 }[size];
  const codeSize = { sm: 6, md: 10, lg: 12 }[size];
  const radius = size === 'sm' ? 6 : 18;
  const [c1, c2] = movie.gradient;
  const patternId = `grain-${movie.id}-${size}`;

  const [imgFailed, setImgFailed] = useState(false);
  const showImage = !!movie.posterUrl && !imgFailed;

  return (
    <View
      style={{
        width: W,
        height: H,
        borderRadius: radius,
        overflow: 'hidden',
        ...(tilt && { transform: [{ rotate: `${tilt}deg` }] }),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: size === 'sm' ? 0 : 0.5,
        shadowRadius: 50,
        elevation: size === 'sm' ? 0 : 12,
      }}
    >
      {/* Gradient is always rendered as the base — it shows through while the
          poster image is loading and serves as the fallback if the image fails
          or is missing entirely. */}
      <LinearGradient
        colors={[c1, c2]}
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

      {!showImage && (
        <>
          {/* film grain + diagonal stripes (gradient fallback only) */}
          <Svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.12 }}>
            <Defs>
              <Pattern id={patternId} x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
                <Rect width="3" height="3" fill="transparent" />
                <SvgCircle cx="1.5" cy="1.5" r="0.4" fill="white" />
              </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </Svg>
          <View
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              opacity: 0.04,
              backgroundColor: 'transparent',
            }}
          >
            {Array.from({ length: Math.ceil(H / 22) + 2 }).map((_, i) => (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  left: -W,
                  top: i * 23 - H / 2,
                  width: W * 3,
                  height: 1,
                  backgroundColor: 'white',
                  transform: [{ rotate: '115deg' }],
                }}
              />
            ))}
          </View>
        </>
      )}

      {/* When showing a real poster, lay a subtle bottom shade so the title and
          code remain legible against bright artwork. */}
      {showImage && (
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.55)']}
          start={{ x: 0.5, y: 0.45 }}
          end={{ x: 0.5, y: 1 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      )}

      {/* corner code */}
      <Text
        style={{
          position: 'absolute',
          top: size === 'sm' ? 4 : 12,
          left: size === 'sm' ? 4 : 14,
          fontFamily: 'JetBrainsMono_400Regular',
          fontSize: codeSize,
          color: 'rgba(255,255,255,0.7)',
          letterSpacing: 0.5,
        }}
      >
        {movie.code}
      </Text>

      {size !== 'sm' && (
        <Text
          style={{
            position: 'absolute',
            bottom: size === 'lg' ? 22 : 16,
            left: size === 'lg' ? 18 : 14,
            right: size === 'lg' ? 18 : 14,
            fontFamily: 'InstrumentSerif_400Regular',
            fontSize: titleSize,
            lineHeight: titleSize * 1.02,
            color: 'white',
            letterSpacing: -0.3,
            textShadowColor: 'rgba(0,0,0,0.5)',
            textShadowRadius: 10,
            textShadowOffset: { width: 0, height: 2 },
          }}
        >
          {movie.title}
        </Text>
      )}
      {size === 'sm' && (
        <Text
          style={{
            position: 'absolute',
            bottom: 3,
            left: 4,
            right: 4,
            fontFamily: 'InstrumentSerif_400Regular',
            fontSize: 8,
            color: 'white',
          }}
          numberOfLines={1}
        >
          {movie.title}
        </Text>
      )}

      {size !== 'sm' && (
        <View
          style={{
            position: 'absolute',
            top: size === 'lg' ? 14 : 12,
            right: size === 'lg' ? 16 : 12,
            backgroundColor: 'rgba(0,0,0,0.35)',
            paddingHorizontal: 6,
            paddingVertical: 3,
            borderRadius: 4,
          }}
        >
          <Text
            style={{
              fontFamily: 'JetBrainsMono_400Regular',
              fontSize: codeSize,
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            {movie.rating}%
          </Text>
        </View>
      )}
    </View>
  );
}
