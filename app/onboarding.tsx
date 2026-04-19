import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInRight,
  SlideInLeft,
  useSharedValue,
  withTiming,
  withDelay,
  withRepeat,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from '@/lib/ThemeContext';
import { withAlpha } from '@/lib/theme';
import { useRoom } from '@/lib/RoomState';
import { FLICK_MOODS, FLICK_MOVIES, FLICK_SERVICES, STORY_CONTENT, type Mood } from '@/lib/data';
import { FlickWordmark } from '@/components/FlickWordmark';
import { FlickPoster } from '@/components/FlickPoster';
import { FlickButton } from '@/components/FlickButton';
import { FlickServiceChip } from '@/components/FlickServiceChip';
import { ProgressDots } from '@/components/ProgressDots';
import { StoryIllustration } from '@/components/StoryIllustration';
import { MiniPhone } from '@/components/MiniPhone';

type StepKind = 'splash' | 'story' | 'name' | 'mood' | 'services' | 'pairing';
interface Step {
  id: string;
  kind: StepKind;
  storyIndex?: 0 | 1 | 2;
}

const STEPS: Step[] = [
  { id: 'splash', kind: 'splash' },
  { id: 'how1',   kind: 'story', storyIndex: 0 },
  { id: 'how2',   kind: 'story', storyIndex: 1 },
  { id: 'how3',   kind: 'story', storyIndex: 2 },
  { id: 'name',   kind: 'name' },
  { id: 'mood',   kind: 'mood' },
  { id: 'svcs',   kind: 'services' },
  { id: 'pair',   kind: 'pairing' },
];

export default function OnboardingScreen() {
  const t = useTheme();
  const router = useRouter();
  const { profile, completeOnboarding } = useRoom();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [name, setName] = useState(profile.name || '');
  const [services, setServices] = useState<string[]>(profile.services || []);
  const [moodDemo, setMoodDemo] = useState<Mood | null>(null);

  const cur = STEPS[step];
  const total = STEPS.length;

  const canNext = () => {
    if (cur.kind === 'name') return name.trim().length >= 1;
    if (cur.kind === 'services') return services.length > 0;
    return true;
  };

  const next = async () => {
    if (step === total - 1) {
      await completeOnboarding({ name: name.trim(), services });
      router.replace('/landing');
      return;
    }
    setDir(1);
    setStep((s) => s + 1);
  };

  const prev = () => {
    if (step <= 0) return;
    setDir(-1);
    setStep((s) => s - 1);
  };

  // Auto-advance splash
  useEffect(() => {
    if (cur.kind === 'splash') {
      const id = setTimeout(() => {
        setDir(1);
        setStep(1);
      }, 1800);
      return () => clearTimeout(id);
    }
  }, [step]);

  const Entering = dir > 0 ? SlideInRight : SlideInLeft;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      {cur.kind !== 'splash' && (
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Pressable
            onPress={prev}
            disabled={step <= 1}
            style={({ pressed }) => ({
              width: 34,
              height: 34,
              borderRadius: 10,
              backgroundColor: t.surface,
              borderWidth: 1,
              borderColor: t.border,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: step <= 1 ? 0.4 : pressed ? 0.7 : 1,
            })}
          >
            <Svg width="12" height="12" viewBox="0 0 14 14">
              <Path
                d="M9 2L3.5 7L9 12"
                stroke={t.text}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          </Pressable>
          <ProgressDots count={total - 1} active={step - 1} />
          <Text
            style={{
              marginLeft: 'auto',
              fontFamily: 'JetBrainsMono_400Regular',
              fontSize: 10,
              color: t.textMute,
              letterSpacing: 1,
            }}
          >
            {step}/{total - 1}
          </Text>
        </View>
      )}

      <Animated.View
        key={cur.id}
        entering={Entering.duration(280)}
        style={{ flex: 1 }}
      >
        {cur.kind === 'splash' && <SplashStep />}
        {cur.kind === 'story' && cur.storyIndex !== undefined && (
          <StoryStep index={cur.storyIndex} />
        )}
        {cur.kind === 'name' && <NameStep name={name} setName={setName} />}
        {cur.kind === 'mood' && <MoodPrimerStep mood={moodDemo} setMood={setMoodDemo} />}
        {cur.kind === 'services' && (
          <ServicesStep services={services} setServices={setServices} />
        )}
        {cur.kind === 'pairing' && <PairingStep name={name} />}
      </Animated.View>

      {cur.kind !== 'splash' && (
        <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
          <FlickButton
            onPress={next}
            disabled={!canNext()}
            size="lg"
            fullWidth
          >
            {step === total - 1 ? "Let's go →" : 'Continue →'}
          </FlickButton>
        </View>
      )}
    </SafeAreaView>
  );
}

// ─── Splash ───
function SplashStep() {
  const t = useTheme();
  const posters = [
    { m: FLICK_MOVIES[1], x: -100, y: -80, rot: -12, delay: 0 },
    { m: FLICK_MOVIES[5], x: 110, y: -40, rot: 8, delay: 300 },
    { m: FLICK_MOVIES[9], x: -60, y: 110, rot: -4, delay: 500 },
  ];
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LinearGradient
        colors={[withAlpha(t.primary, 0.2), 'transparent']}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      {posters.map((p, i) => (
        <SplashPoster key={i} {...p} />
      ))}
      <Animated.View entering={FadeInDown.delay(300).duration(600)} style={{ alignItems: 'center', zIndex: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text
            style={{
              fontFamily: 'InstrumentSerif_400Regular',
              fontSize: 72,
              color: t.text,
              letterSpacing: -2,
            }}
          >
            Flick
          </Text>
          <Text
            style={{
              fontFamily: 'InstrumentSerif_400Regular_Italic',
              fontSize: 72,
              color: t.primary,
              letterSpacing: -2,
            }}
          >
            !
          </Text>
        </View>
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular_Italic',
            fontSize: 18,
            color: t.textDim,
            marginTop: 10,
            letterSpacing: -0.2,
          }}
        >
          tonight, pick together
        </Text>
      </Animated.View>
    </View>
  );
}

function SplashPoster({
  m,
  x,
  y,
  rot,
  delay,
}: {
  m: typeof FLICK_MOVIES[number];
  x: number;
  y: number;
  rot: number;
  delay: number;
}) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.7);
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.35, { duration: 800 }));
    scale.value = withDelay(delay, withTiming(0.55, { duration: 800 }));
  }, []);
  const aStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: x },
      { translateY: y },
      { rotate: `${rot}deg` },
      { scale: scale.value },
    ],
  }));
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: '50%',
          top: '50%',
          marginLeft: -110,
          marginTop: -165,
        },
        aStyle,
      ]}
    >
      <FlickPoster movie={m} size="md" />
    </Animated.View>
  );
}

// ─── Story (steps 2-4) ───
function StoryStep({ index }: { index: 0 | 1 | 2 }) {
  const t = useTheme();
  const c = STORY_CONTENT[index];
  return (
    <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 20 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <StoryIllustration index={index} />
      </View>
      <View>
        <Text
          style={{
            fontFamily: 'JetBrainsMono_400Regular',
            fontSize: 11,
            color: t.primary,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          {c.eyebrow}
        </Text>
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular',
            fontSize: 44,
            lineHeight: 44,
            color: t.text,
            letterSpacing: -1,
            marginTop: 10,
          }}
        >
          {c.title}
          {'\n'}
          <Text
            style={{
              fontFamily: 'InstrumentSerif_400Regular_Italic',
              color: t.primary,
            }}
          >
            {c.titleItalic}
          </Text>
        </Text>
        <Text
          style={{
            fontFamily: 'Geist_400Regular',
            fontSize: 14,
            color: t.textDim,
            lineHeight: 21,
            marginTop: 14,
            maxWidth: 320,
          }}
        >
          {c.body}
        </Text>
      </View>
    </View>
  );
}

// ─── Name (step 5) ───
function NameStep({ name, setName }: { name: string; setName: (s: string) => void }) {
  const t = useTheme();
  return (
    <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 30 }}>
      <Text
        style={{
          fontFamily: 'JetBrainsMono_400Regular',
          fontSize: 11,
          color: t.primary,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        04 · you
      </Text>
      <Text
        style={{
          fontFamily: 'InstrumentSerif_400Regular',
          fontSize: 44,
          lineHeight: 44,
          color: t.text,
          letterSpacing: -1,
          marginTop: 10,
        }}
      >
        What should we{' '}
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular_Italic',
            color: t.primary,
          }}
        >
          call you
        </Text>
        ?
      </Text>
      <Text
        style={{
          color: t.textDim,
          fontSize: 14,
          marginTop: 10,
          fontFamily: 'Geist_400Regular',
          maxWidth: 300,
        }}
      >
        So your partner knows whose room they're joining.
      </Text>

      <View style={{ marginTop: 36 }}>
        <TextInput
          autoFocus
          value={name}
          onChangeText={(v) => setName(v.slice(0, 24))}
          placeholder="First name"
          placeholderTextColor={t.textMute}
          style={{
            paddingVertical: 16,
            paddingHorizontal: 18,
            backgroundColor: t.surface,
            borderWidth: 1,
            borderColor: t.border,
            borderRadius: 14,
            fontFamily: 'InstrumentSerif_400Regular',
            fontSize: 24,
            color: t.text,
            letterSpacing: -0.3,
          }}
        />
        <Text
          style={{
            marginTop: 10,
            fontFamily: 'JetBrainsMono_400Regular',
            fontSize: 10,
            color: t.textMute,
            letterSpacing: 1,
          }}
        >
          {name.length}/24
        </Text>
      </View>

      {name ? (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={{
            marginTop: 30,
            padding: 16,
            borderRadius: 14,
            backgroundColor: t.surface,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: t.border,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: t.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'InstrumentSerif_400Regular',
                fontSize: 18,
                color: 'white',
              }}
            >
              {name[0]?.toUpperCase()}
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: 'JetBrainsMono_400Regular',
                fontSize: 10,
                color: t.textMute,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              Partner sees
            </Text>
            <Text
              style={{
                fontFamily: 'Geist_400Regular',
                fontSize: 14,
                color: t.text,
                marginTop: 2,
              }}
            >
              Join <Text style={{ fontFamily: 'Geist_600SemiBold' }}>{name}</Text>'s room
            </Text>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}

// ─── Mood primer (step 6) ───
function MoodPrimerStep({ mood, setMood }: { mood: Mood | null; setMood: (m: Mood | null) => void }) {
  const t = useTheme();
  const moods = FLICK_MOODS.slice(0, 4);
  return (
    <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 30 }}>
      <Text
        style={{
          fontFamily: 'JetBrainsMono_400Regular',
          fontSize: 11,
          color: t.primary,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        05 · moods
      </Text>
      <Text
        style={{
          fontFamily: 'InstrumentSerif_400Regular',
          fontSize: 40,
          lineHeight: 40,
          color: t.text,
          letterSpacing: -1,
          marginTop: 10,
        }}
      >
        Every room has a{' '}
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular_Italic',
            color: t.primary,
          }}
        >
          mood
        </Text>
        .
      </Text>
      <Text
        style={{
          color: t.textDim,
          fontSize: 14,
          marginTop: 10,
          fontFamily: 'Geist_400Regular',
          maxWidth: 320,
        }}
      >
        Pick one each time you start — we only pre-load films that fit. Try tapping one.
      </Text>
      <View
        style={{
          marginTop: 24,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
          flex: 1,
        }}
      >
        {moods.map((m) => {
          const on = mood === m.id;
          return (
            <Pressable
              key={m.id}
              onPress={() => setMood(on ? null : (m.id as Mood))}
              style={{
                flexBasis: '48%',
                minHeight: 100,
                backgroundColor: on ? t.surface2 : t.surface,
                borderWidth: 1,
                borderColor: on ? t.primary : t.border,
                borderRadius: 16,
                padding: 14,
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  fontFamily: 'InstrumentSerif_400Regular',
                  fontSize: 32,
                  color: on ? t.primary : t.textDim,
                  lineHeight: 32,
                }}
              >
                {m.glyph}
              </Text>
              <View>
                <Text style={{ fontFamily: 'Geist_600SemiBold', fontSize: 15, color: t.text }}>
                  {m.label}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Geist_400Regular',
                    fontSize: 11,
                    color: t.textMute,
                    marginTop: 2,
                  }}
                >
                  {m.sub}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <View
        style={{
          padding: 12,
          borderRadius: 12,
          marginTop: 10,
          backgroundColor: t.surface,
          borderWidth: 1,
          borderColor: t.border,
        }}
      >
        <Text style={{ fontFamily: 'Geist_400Regular', fontSize: 12, color: t.textDim }}>
          <Text style={{ color: t.accent, fontFamily: 'Geist_600SemiBold' }}>Try it — </Text>
          this tap is just a preview. You'll pick for real each session.
        </Text>
      </View>
    </View>
  );
}

// ─── Services (step 7) ───
function ServicesStep({
  services,
  setServices,
}: {
  services: string[];
  setServices: (s: string[]) => void;
}) {
  const t = useTheme();
  const toggle = (id: string) =>
    setServices(services.includes(id) ? services.filter((x) => x !== id) : [...services, id]);
  return (
    <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 30 }}>
      <Text
        style={{
          fontFamily: 'JetBrainsMono_400Regular',
          fontSize: 11,
          color: t.primary,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        06 · streaming
      </Text>
      <Text
        style={{
          fontFamily: 'InstrumentSerif_400Regular',
          fontSize: 40,
          lineHeight: 40,
          color: t.text,
          letterSpacing: -1,
          marginTop: 10,
        }}
      >
        What do you{' '}
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular_Italic',
            color: t.primary,
          }}
        >
          stream
        </Text>
        ?
      </Text>
      <Text
        style={{
          color: t.textDim,
          fontSize: 14,
          marginTop: 10,
          fontFamily: 'Geist_400Regular',
          maxWidth: 320,
        }}
      >
        Set once — we'll remember. We only show films you can actually watch.
      </Text>
      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          flex: 1,
        }}
      >
        {FLICK_SERVICES.map((s) => (
          <FlickServiceChip
            key={s.id}
            service={s}
            selected={services.includes(s.id)}
            onPress={() => toggle(s.id)}
          />
        ))}
      </View>
      <View
        style={{
          padding: 12,
          borderRadius: 12,
          marginTop: 10,
          backgroundColor: t.surface,
          borderWidth: 1,
          borderColor: t.border,
        }}
      >
        <Text style={{ fontFamily: 'Geist_400Regular', fontSize: 12, color: t.textDim }}>
          <Text style={{ color: t.accent, fontFamily: 'Geist_600SemiBold' }}>
            {services.length} selected —{' '}
          </Text>
          you can change these any time in settings.
        </Text>
      </View>
    </View>
  );
}

// ─── Pairing preview (step 8) ───
function PairingStep({ name }: { name: string }) {
  const t = useTheme();
  const dash = useSharedValue(0);
  useEffect(() => {
    dash.value = withRepeat(
      withTiming(-12, { duration: 800, easing: Easing.linear }),
      -1,
      false
    );
  }, []);
  return (
    <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 30 }}>
      <Text
        style={{
          fontFamily: 'JetBrainsMono_400Regular',
          fontSize: 11,
          color: t.primary,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        07 · together
      </Text>
      <Text
        style={{
          fontFamily: 'InstrumentSerif_400Regular',
          fontSize: 40,
          lineHeight: 40,
          color: t.text,
          letterSpacing: -1,
          marginTop: 10,
        }}
      >
        One last thing —{' '}
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular_Italic',
            color: t.primary,
          }}
        >
          how pairing works
        </Text>
        .
      </Text>
      <Text
        style={{
          color: t.textDim,
          fontSize: 14,
          marginTop: 10,
          fontFamily: 'Geist_400Regular',
          maxWidth: 320,
        }}
      >
        Flick! is always two devices. Here's what happens next time you open the app.
      </Text>

      <View
        style={{
          flex: 1,
          marginTop: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <View style={{ alignItems: 'center', gap: 8 }}>
          <MiniPhone>
            <Text
              style={{
                fontFamily: 'InstrumentSerif_400Regular',
                fontSize: 14,
                color: t.text,
                textAlign: 'center',
                paddingVertical: 8,
              }}
            >
              room NX7K2
            </Text>
            <View
              style={{
                width: 50,
                height: 50,
                backgroundColor: t.surface,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: t.border,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: 'JetBrainsMono_500Medium',
                  fontSize: 9,
                  color: t.primary,
                  letterSpacing: 1,
                }}
              >
                HOST
              </Text>
            </View>
          </MiniPhone>
          <Text
            style={{
              fontFamily: 'JetBrainsMono_400Regular',
              fontSize: 9,
              color: t.textMute,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            you · app
          </Text>
        </View>

        <Svg width="40" height="30">
          <Path
            d="M 0 15 L 40 15"
            stroke={t.primary}
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
        </Svg>

        <View style={{ alignItems: 'center', gap: 8 }}>
          <MiniPhone>
            <Text
              style={{
                fontFamily: 'Geist_400Regular',
                fontSize: 9,
                color: t.textDim,
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Incoming
            </Text>
            <Text
              style={{
                fontFamily: 'InstrumentSerif_400Regular',
                fontSize: 14,
                color: t.text,
                lineHeight: 17,
              }}
            >
              {name || 'Your partner'} started a room
            </Text>
            <View
              style={{
                marginTop: 10,
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderRadius: 8,
                backgroundColor: t.primary,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Geist_600SemiBold',
                  fontSize: 11,
                  color: 'white',
                }}
              >
                Tap to join →
              </Text>
            </View>
          </MiniPhone>
          <Text
            style={{
              fontFamily: 'JetBrainsMono_400Regular',
              fontSize: 9,
              color: t.textMute,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            partner · app
          </Text>
        </View>
      </View>

      <View
        style={{
          padding: 14,
          borderRadius: 14,
          backgroundColor: t.surface,
          borderWidth: 1,
          borderColor: t.border,
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontFamily: 'Geist_400Regular',
            fontSize: 13,
            color: t.textDim,
            lineHeight: 19,
          }}
        >
          Both of you install Flick! once. After that, either can start a room from the couch, the commute, or two time zones apart — swipes sync in realtime.
        </Text>
      </View>
    </View>
  );
}
