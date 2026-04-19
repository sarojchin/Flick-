import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useTheme } from '@/lib/ThemeContext';
import { useRoom } from '@/lib/RoomState';
import { FLICK_SERVICES } from '@/lib/data';
import { ScreenHeader } from '@/components/ScreenHeader';
import { FlickButton } from '@/components/FlickButton';
import { FlickServiceChip } from '@/components/FlickServiceChip';

export default function ServicesScreen() {
  const t = useTheme();
  const router = useRouter();
  const { roomServices, setRoomServices } = useRoom();

  const toggle = (id: string) =>
    setRoomServices(
      roomServices.includes(id)
        ? roomServices.filter((x) => x !== id)
        : [...roomServices, id]
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ paddingTop: 8 }}>
        <ScreenHeader onBack={() => router.back()} step="02 / 03" />
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
          Your{' '}
          <Text
            style={{
              fontFamily: 'InstrumentSerif_400Regular_Italic',
              color: t.primary,
            }}
          >
            streaming
          </Text>
          .
        </Text>
        <Text
          style={{
            color: t.textDim,
            fontSize: 14,
            marginTop: 10,
            fontFamily: 'Geist_400Regular',
          }}
        >
          Pick what you have. Your partner will pick theirs.
        </Text>
      </View>

      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 20,
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        {FLICK_SERVICES.map((s) => (
          <FlickServiceChip
            key={s.id}
            service={s}
            selected={roomServices.includes(s.id)}
            onPress={() => toggle(s.id)}
          />
        ))}
      </View>

      <View
        style={{
          marginHorizontal: 24,
          marginBottom: 16,
          padding: 14,
          borderRadius: 14,
          backgroundColor: t.surface,
          borderWidth: 1,
          borderColor: t.border,
        }}
      >
        <Text
          style={{
            fontFamily: 'Geist_400Regular',
            fontSize: 12,
            color: t.textDim,
          }}
        >
          <Text style={{ color: t.accent, fontFamily: 'Geist_600SemiBold' }}>
            Good to know —{' '}
          </Text>
          we only show films available on services you or your partner have.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <FlickButton
          onPress={() => router.push('/qr')}
          disabled={roomServices.length === 0}
          size="lg"
          fullWidth
        >
          Create room  →
        </FlickButton>
      </View>
    </SafeAreaView>
  );
}
