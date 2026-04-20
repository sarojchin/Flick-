import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useTheme } from '@/lib/ThemeContext';
import { useThemeControls } from '@/lib/ThemeContext';
import { THEMES, type ThemeKey } from '@/lib/theme';
import { useRoom } from '@/lib/RoomState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { FlickButton } from '@/components/FlickButton';
import { FlickWordmark } from '@/components/FlickWordmark';

export default function Settings() {
  const t = useTheme();
  const router = useRouter();
  const { themeKey, setThemeKey } = useThemeControls();
  const { profile, updateMode, resetOnboarding } = useRoom();

  const onReplayOnboarding = async () => {
    await resetOnboarding();
    router.replace('/onboarding');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ paddingTop: 8 }}>
        <ScreenHeader onBack={() => router.back()} step="SETTINGS" />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 20 }}>
          <FlickWordmark size={22} />
          <Text
            style={{
              fontFamily: 'InstrumentSerif_400Regular',
              fontSize: 40,
              lineHeight: 42,
              color: t.text,
              letterSpacing: -1,
              marginTop: 16,
            }}
          >
            Settings.
          </Text>
        </View>

        <Section title="PROFILE">
          <Row label="Name" value={profile.name || 'Not set'} />
          <Row label="Streaming" value={`${profile.services.length} selected`} />
        </Section>

        <Section title="MODE">
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['solo', 'couple'] as const).map((m) => {
              const on = profile.mode === m;
              const label = m === 'solo' ? 'For you' : 'With a partner';
              return (
                <Pressable
                  key={m}
                  onPress={() => updateMode(m)}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: on ? t.surface2 : 'transparent',
                    borderWidth: 1,
                    borderColor: on ? t.primary : t.border,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: on ? 'Geist_600SemiBold' : 'Geist_400Regular',
                      fontSize: 13,
                      color: t.text,
                    }}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title="COLOR THEME">
          <View style={{ gap: 8 }}>
            {(Object.keys(THEMES) as ThemeKey[]).map((key) => {
              const th = THEMES[key];
              const on = themeKey === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => setThemeKey(key)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: on ? t.surface2 : 'transparent',
                    borderWidth: 1,
                    borderColor: on ? t.primary : t.border,
                  }}
                >
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    {[th.bg, th.primary, th.accent].map((c, i) => (
                      <View
                        key={i}
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 4,
                          backgroundColor: c,
                          borderWidth: 1,
                          borderColor: t.border,
                        }}
                      />
                    ))}
                  </View>
                  <Text
                    style={{
                      fontFamily: on ? 'Geist_600SemiBold' : 'Geist_400Regular',
                      fontSize: 14,
                      color: t.text,
                      flex: 1,
                    }}
                  >
                    {th.name}
                  </Text>
                  {on && (
                    <Text
                      style={{
                        fontFamily: 'JetBrainsMono_400Regular',
                        fontSize: 10,
                        color: t.primary,
                        letterSpacing: 1,
                      }}
                    >
                      ACTIVE
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title="ONBOARDING">
          <FlickButton variant="ghost" onPress={onReplayOnboarding} fullWidth>
            Replay onboarding
          </FlickButton>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ paddingHorizontal: 24, paddingTop: 28 }}>
      <Text
        style={{
          fontFamily: 'JetBrainsMono_400Regular',
          fontSize: 10,
          color: t.textMute,
          letterSpacing: 1.5,
          marginBottom: 10,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const t = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: t.border,
      }}
    >
      <Text style={{ fontFamily: 'Geist_400Regular', fontSize: 14, color: t.textDim }}>
        {label}
      </Text>
      <Text style={{ fontFamily: 'Geist_500Medium', fontSize: 14, color: t.text }}>
        {value}
      </Text>
    </View>
  );
}
