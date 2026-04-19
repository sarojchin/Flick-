import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useTheme } from '@/lib/ThemeContext';
import { useRoom } from '@/lib/RoomState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { FlickButton } from '@/components/FlickButton';
import { FlickWordmark } from '@/components/FlickWordmark';

export default function JoinScreen() {
  const t = useTheme();
  const router = useRouter();
  const { setPartnerJoined, resetRoom } = useRoom();
  const [code, setCode] = useState('');

  const onJoin = () => {
    resetRoom();
    setPartnerJoined(true);
    router.replace('/swipe');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ paddingTop: 8 }}>
        <ScreenHeader onBack={() => router.back()} step="JOIN" />
      </View>
      <View style={{ paddingHorizontal: 24, paddingTop: 30 }}>
        <FlickWordmark size={20} />
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular',
            fontSize: 40,
            lineHeight: 42,
            color: t.text,
            letterSpacing: -1,
            marginTop: 24,
          }}
        >
          Got a{' '}
          <Text
            style={{
              fontFamily: 'InstrumentSerif_400Regular_Italic',
              color: t.primary,
            }}
          >
            room code
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
          Enter the 5-character code your partner sent you.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 24, marginTop: 40, alignItems: 'center' }}>
        <TextInput
          autoFocus
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={5}
          value={code}
          onChangeText={(s) => setCode(s.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
          placeholder="NX7K2"
          placeholderTextColor={t.textMute}
          style={{
            width: '100%',
            paddingVertical: 18,
            paddingHorizontal: 18,
            backgroundColor: t.surface,
            borderWidth: 1,
            borderColor: t.border,
            borderRadius: 14,
            fontFamily: 'JetBrainsMono_500Medium',
            fontSize: 36,
            color: t.text,
            letterSpacing: 12,
            textAlign: 'center',
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
          {code.length}/5
        </Text>
      </View>

      <View style={{ flex: 1 }} />

      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <FlickButton onPress={onJoin} disabled={code.length < 5} size="lg" fullWidth>
          Join room  →
        </FlickButton>
      </View>
    </SafeAreaView>
  );
}
