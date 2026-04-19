import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { useTheme } from '@/lib/ThemeContext';
import { useRoom } from '@/lib/RoomState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { FlickButton } from '@/components/FlickButton';
import { FlickQRCode } from '@/components/FlickQRCode';
import { FlickStatusDot } from '@/components/FlickStatusDot';

export default function QRScreen() {
  const t = useTheme();
  const router = useRouter();
  const { roomId, partnerJoined, setPartnerJoined } = useRoom();
  const url = `flick.app/r/${roomId}`;

  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0);

  useEffect(() => {
    if (partnerJoined) {
      ringOpacity.value = 1;
      ringScale.value = withRepeat(
        withTiming(1.06, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [partnerJoined]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ paddingTop: 8 }}>
        <ScreenHeader onBack={() => router.back()} step="03 / 03" />
      </View>
      <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular',
            fontSize: 32,
            lineHeight: 34,
            color: t.text,
            letterSpacing: -0.6,
          }}
        >
          {partnerJoined ? (
            <>
              Your partner's{' '}
              <Text
                style={{
                  fontFamily: 'InstrumentSerif_400Regular_Italic',
                  color: t.yes,
                }}
              >
                in
              </Text>
              .
            </>
          ) : (
            <>
              Hand them{' '}
              <Text
                style={{
                  fontFamily: 'InstrumentSerif_400Regular_Italic',
                  color: t.primary,
                }}
              >
                your phone
              </Text>
              .
            </>
          )}
        </Text>
        <Text
          style={{
            color: t.textDim,
            fontSize: 14,
            marginTop: 8,
            fontFamily: 'Geist_400Regular',
          }}
        >
          {partnerJoined
            ? 'Ready when you both are.'
            : 'Or text the link. They scan once, install Flick!, then they can host too.'}
        </Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <View>
          <FlickQRCode value={url} size={240} />
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                top: -6, left: -6, right: -6, bottom: -6,
                borderRadius: 20,
                borderWidth: 3,
                borderColor: t.yes,
              },
              ringStyle,
            ]}
          />
        </View>

        <View style={{ marginTop: 28, alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: 'JetBrainsMono_400Regular',
              fontSize: 11,
              color: t.textMute,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            Room code
          </Text>
          <Text
            style={{
              fontFamily: 'JetBrainsMono_500Medium',
              fontSize: 32,
              color: t.text,
              letterSpacing: 6,
              marginTop: 4,
            }}
          >
            {roomId}
          </Text>
        </View>

        <View
          style={{
            marginTop: 20,
            paddingVertical: 12,
            paddingHorizontal: 18,
            backgroundColor: t.surface,
            borderWidth: 1,
            borderColor: partnerJoined ? t.yes : t.border,
            borderRadius: 99,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <FlickStatusDot
            live={partnerJoined}
            color={partnerJoined ? t.yes : undefined}
            label={partnerJoined ? 'Partner connected' : 'Waiting for partner'}
          />
          {!partnerJoined && (
            <Pressable onPress={() => setPartnerJoined(true)} hitSlop={8}>
              <Text
                style={{
                  color: t.primary,
                  fontFamily: 'Geist_600SemiBold',
                  fontSize: 12,
                  textDecorationLine: 'underline',
                }}
              >
                simulate join
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <FlickButton
          onPress={() => router.push('/swipe')}
          disabled={!partnerJoined}
          size="lg"
          fullWidth
        >
          {partnerJoined ? 'Start swiping  →' : 'Waiting...'}
        </FlickButton>
      </View>
    </SafeAreaView>
  );
}
