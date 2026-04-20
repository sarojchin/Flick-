import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  withSpring,
  Easing,
  SlideInDown,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from '@/lib/ThemeContext';
import { useRoom } from '@/lib/RoomState';
import { type Movie } from '@/lib/data';
import { SwipeCard } from '@/components/SwipeCard';
import { ActionButton } from '@/components/ActionButton';
import { FlickStatusDot } from '@/components/FlickStatusDot';
import { FlickPoster } from '@/components/FlickPoster';
import { FlickButton } from '@/components/FlickButton';
import { MatchOverlay } from '@/components/MatchOverlay';

type Verdict = 'yes' | 'no' | 'maybe';

export default function SwipeScreen() {
  const t = useTheme();
  const router = useRouter();
  const {
    deck,
    deckIdx,
    setDeckIdx,
    matches,
    maybes,
    addMatch,
    addMaybe,
    matchMovie,
    setMatchMovie,
    deckLoading,
    deckError,
    reloadDeck,
  } = useRoom();

  const current = deck[deckIdx];
  const next = deck[deckIdx + 1];
  const afterNext = deck[deckIdx + 2];

  const dx = useSharedValue(0);
  const dy = useSharedValue(0);

  const [partnerHint, setPartnerHint] = useState<{ verdict: 'yes' | 'no'; movie: Movie } | null>(null);

  // Partner ghost-swipe simulation
  useEffect(() => {
    const id = setInterval(() => {
      const verdict: 'yes' | 'no' = Math.random() < 0.55 ? 'yes' : 'no';
      const movie = deck[deckIdx + Math.floor(Math.random() * 2)];
      if (!movie) return;
      setPartnerHint({ verdict, movie });
      const t2 = setTimeout(() => setPartnerHint(null), 2400);
      return () => clearTimeout(t2);
    }, 5000);
    return () => clearInterval(id);
  }, [deckIdx, deck]);

  const advance = () => {
    setDeckIdx((i) => i + 1);
    dx.value = 0;
    dy.value = 0;
  };

  const commit = (verdict: Verdict) => {
    if (!current) return;
    if (verdict === 'yes') {
      const willMatch = Math.random() < 0.35 || deckIdx === 2;
      if (willMatch) {
        setTimeout(() => addMatch(current), 320);
      }
    }
    if (verdict === 'maybe') {
      addMaybe(current);
    }
    if (verdict === 'yes') {
      dx.value = withTiming(500, { duration: 260, easing: Easing.out(Easing.quad) }, () => {
        runOnJS(advance)();
      });
      dy.value = withTiming(-60, { duration: 260 });
    } else if (verdict === 'no') {
      dx.value = withTiming(-500, { duration: 260, easing: Easing.out(Easing.quad) }, () => {
        runOnJS(advance)();
      });
      dy.value = withTiming(-60, { duration: 260 });
    } else {
      dy.value = withTiming(-700, { duration: 280, easing: Easing.out(Easing.quad) }, () => {
        runOnJS(advance)();
      });
    }
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      dx.value = e.translationX;
      dy.value = e.translationY;
    })
    .onEnd(() => {
      if (dy.value < -120 && Math.abs(dy.value) > Math.abs(dx.value)) {
        runOnJS(commit)('maybe');
      } else if (dx.value > 110) {
        runOnJS(commit)('yes');
      } else if (dx.value < -110) {
        runOnJS(commit)('no');
      } else {
        dx.value = withSpring(0);
        dy.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const verticalLead = dy.value < 0 && Math.abs(dy.value) > Math.abs(dx.value);
    const rot = verticalLead ? 0 : dx.value / 18;
    return {
      transform: [
        { translateX: dx.value },
        { translateY: verticalLead ? dy.value : dy.value * 0.3 },
        { rotate: `${rot}deg` },
      ],
    };
  });

  const nextCardStyle = useAnimatedStyle(() => {
    const intensity = Math.abs(dx.value);
    return {
      transform: [
        { scale: 0.96 + interpolate(intensity, [0, 200], [0, 0.04], Extrapolation.CLAMP) },
        { translateY: 12 - interpolate(intensity, [0, 200], [0, 10], Extrapolation.CLAMP) },
      ],
      opacity: 0.85,
    };
  });

  if (!current) {
    if (deckLoading) {
      return <DeckLoading />;
    }
    if (deckError) {
      return <DeckError message={deckError} onRetry={reloadDeck} onExit={() => router.replace('/landing')} />;
    }
    return <EmptyStack onExit={() => router.replace('/matches')} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <View
        style={{
          paddingTop: 8,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Pressable
          onPress={() => router.replace('/landing')}
          style={({ pressed }) => ({
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor: t.surface,
            borderWidth: 1,
            borderColor: t.border,
            alignItems: 'center',
            justifyContent: 'center',
            ...(pressed && { transform: [{ scale: 0.93 }] }),
          })}
        >
          <Svg width="12" height="12" viewBox="0 0 12 12">
            <Path
              d="M2 2L10 10M10 2L2 10"
              stroke={t.text}
              strokeWidth={1.6}
              strokeLinecap="round"
            />
          </Svg>
        </Pressable>

        <View style={{ alignItems: 'center' }}>
          <FlickStatusDot live label="both swiping" color={t.yes} />
          <Text
            style={{
              fontFamily: 'JetBrainsMono_400Regular',
              fontSize: 10,
              color: t.textMute,
              letterSpacing: 1,
              marginTop: 3,
            }}
          >
            {deckIdx + 1}/{deck.length}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/matches')}
          style={({ pressed }) => ({
            paddingHorizontal: 10,
            height: 36,
            borderRadius: 12,
            backgroundColor: t.surface,
            borderWidth: 1,
            borderColor: t.border,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            ...(pressed && { transform: [{ scale: 0.95 }] }),
          })}
        >
          <Text style={{ color: t.primary, fontFamily: 'Geist_600SemiBold' }}>♡</Text>
          <Text style={{ color: t.text, fontFamily: 'Geist_600SemiBold', fontSize: 13 }}>
            {matches.length}
          </Text>
          <Text style={{ color: t.textMute, opacity: 0.5 }}>·</Text>
          <Text style={{ color: t.accent, fontFamily: 'Geist_600SemiBold' }}>?</Text>
          <Text style={{ color: t.text, fontFamily: 'Geist_600SemiBold', fontSize: 13 }}>
            {maybes.length}
          </Text>
        </Pressable>
      </View>

      {partnerHint && (
        <Animated.View
          entering={SlideInDown.duration(300)}
          style={{
            position: 'absolute',
            top: 100,
            alignSelf: 'center',
            backgroundColor: t.surface2,
            borderWidth: 1,
            borderColor: t.border,
            borderRadius: 99,
            paddingVertical: 6,
            paddingLeft: 6,
            paddingRight: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            zIndex: 20,
          }}
        >
          <FlickPoster movie={partnerHint.movie} size="sm" />
          <Text style={{ color: t.textDim, fontFamily: 'Geist_400Regular', fontSize: 12 }}>
            Jordan said{' '}
            <Text
              style={{
                color: partnerHint.verdict === 'yes' ? t.yes : t.no,
                fontFamily: 'Geist_600SemiBold',
              }}
            >
              {partnerHint.verdict}
            </Text>
          </Text>
        </Animated.View>
      )}

      <View
        style={{
          flex: 1,
          marginHorizontal: 20,
          marginTop: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {afterNext && (
          <View
            key={afterNext.id}
            style={{
              position: 'absolute',
              transform: [{ scale: 0.92 }, { translateY: 24 }],
              opacity: 0.5,
            }}
            pointerEvents="none"
          >
            <SwipeCard movie={afterNext} />
          </View>
        )}
        {next && (
          <Animated.View
            key={next.id}
            style={[
              { position: 'absolute' },
              nextCardStyle,
            ]}
            pointerEvents="none"
          >
            <SwipeCard movie={next} />
          </Animated.View>
        )}
        <GestureDetector gesture={pan}>
          <Animated.View key={current.id} style={[{ position: 'absolute' }, cardStyle]}>
            <SwipeCard movie={current} dx={dx} dy={dy} />
          </Animated.View>
        </GestureDetector>
      </View>

      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'JetBrainsMono_400Regular',
          fontSize: 9,
          color: t.textMute,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        ← nope  ·  ↑ maybe  ·  yes →
      </Text>

      <View
        style={{
          paddingHorizontal: 24,
          paddingBottom: 32,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <ActionButton icon="×" color={t.no} onPress={() => commit('no')} />
        <ActionButton icon="?" color={t.accent} small onPress={() => commit('maybe')} />
        <ActionButton icon="♡" color={t.yes} big onPress={() => commit('yes')} />
      </View>

      {matchMovie && (
        <MatchOverlay
          movie={matchMovie}
          onClose={() => setMatchMovie(null)}
          onOpenMatches={() => {
            setMatchMovie(null);
            router.push('/matches');
          }}
        />
      )}
    </SafeAreaView>
  );
}

function DeckLoading() {
  const t = useTheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: t.bg,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }}
    >
      <Text
        style={{
          fontFamily: 'InstrumentSerif_400Regular',
          fontSize: 36,
          color: t.text,
          letterSpacing: -0.8,
          textAlign: 'center',
        }}
      >
        Loading{' '}
        <Text style={{ fontFamily: 'InstrumentSerif_400Regular_Italic', color: t.primary }}>
          tonight's
        </Text>{' '}
        films…
      </Text>
      <Text
        style={{
          fontFamily: 'JetBrainsMono_400Regular',
          fontSize: 10,
          color: t.textMute,
          letterSpacing: 1.5,
          marginTop: 18,
        }}
      >
        TMDB · curating your deck
      </Text>
    </SafeAreaView>
  );
}

function DeckError({
  message,
  onRetry,
  onExit,
}: {
  message: string;
  onRetry: () => void;
  onExit: () => void;
}) {
  const t = useTheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: t.bg,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }}
    >
      <Text
        style={{
          fontFamily: 'InstrumentSerif_400Regular',
          fontSize: 40,
          color: t.text,
          letterSpacing: -0.8,
          textAlign: 'center',
        }}
      >
        Couldn't reach{' '}
        <Text style={{ fontFamily: 'InstrumentSerif_400Regular_Italic', color: t.no }}>
          TMDB
        </Text>
        .
      </Text>
      <Text
        style={{
          color: t.textDim,
          fontFamily: 'Geist_400Regular',
          fontSize: 13,
          marginTop: 14,
          textAlign: 'center',
          maxWidth: 320,
        }}
      >
        {message}
      </Text>
      <View style={{ marginTop: 28, flexDirection: 'row', gap: 10 }}>
        <FlickButton variant="surface" onPress={onExit} size="md">
          Back
        </FlickButton>
        <FlickButton onPress={onRetry} size="md">
          Try again
        </FlickButton>
      </View>
    </SafeAreaView>
  );
}

function EmptyStack({ onExit }: { onExit: () => void }) {
  const t = useTheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: t.bg,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }}
    >
      <Text
        style={{
          fontFamily: 'InstrumentSerif_400Regular',
          fontSize: 44,
          lineHeight: 44,
          color: t.text,
          letterSpacing: -1,
          textAlign: 'center',
        }}
      >
        Out of{' '}
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular_Italic',
            color: t.primary,
          }}
        >
          films
        </Text>
        .
      </Text>
      <Text
        style={{
          color: t.textDim,
          fontFamily: 'Geist_400Regular',
          fontSize: 14,
          marginTop: 14,
          maxWidth: 280,
          textAlign: 'center',
        }}
      >
        You swiped through the whole stack. Check your matches or start a fresh round.
      </Text>
      <View style={{ marginTop: 28 }}>
        <FlickButton onPress={onExit} size="lg">
          See matches →
        </FlickButton>
      </View>
    </SafeAreaView>
  );
}
