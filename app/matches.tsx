import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useTheme } from '@/lib/ThemeContext';
import { useRoom } from '@/lib/RoomState';
import { FLICK_SERVICES, type Movie } from '@/lib/data';
import { ScreenHeader } from '@/components/ScreenHeader';
import { FlickPoster } from '@/components/FlickPoster';

type Tab = 'matches' | 'maybes';

export default function MatchesList() {
  const t = useTheme();
  const router = useRouter();
  const { matches, maybes } = useRoom();
  const [tab, setTab] = useState<Tab>('matches');

  const list = tab === 'matches' ? matches : maybes;
  const isMaybe = tab === 'maybes';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ paddingTop: 8 }}>
        <ScreenHeader
          onBack={() => router.back()}
          step={`${matches.length + maybes.length} saved`}
        />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
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
                color: isMaybe ? t.accent : t.primary,
              }}
            >
              {isMaybe ? 'maybes' : 'matches'}
            </Text>
            .
          </Text>
          <Text
            style={{
              color: t.textDim,
              fontSize: 14,
              marginTop: 8,
              fontFamily: 'Geist_400Regular',
            }}
          >
            {isMaybe
              ? 'Saved for later — no partner required.'
              : 'Films you both said yes to.'}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 6,
            paddingHorizontal: 24,
            paddingTop: 16,
          }}
        >
          {(
            [
              { id: 'matches', label: 'Matches', count: matches.length, color: t.primary },
              { id: 'maybes', label: 'Maybes', count: maybes.length, color: t.accent },
            ] as const
          ).map((s) => {
            const on = tab === s.id;
            return (
              <Pressable
                key={s.id}
                onPress={() => setTab(s.id)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 99,
                  backgroundColor: on ? t.surface2 : 'transparent',
                  borderWidth: 1,
                  borderColor: on ? s.color : t.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Geist_600SemiBold',
                    fontSize: 13,
                    color: on ? t.text : t.textDim,
                  }}
                >
                  {s.label}
                </Text>
                <View
                  style={{
                    paddingHorizontal: 7,
                    paddingVertical: 1,
                    borderRadius: 99,
                    backgroundColor: on ? s.color : t.surface,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'JetBrainsMono_400Regular',
                      fontSize: 10,
                      color: on ? t.bg : t.textMute,
                    }}
                  >
                    {s.count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 14, gap: 10 }}>
          {list.length === 0 ? (
            <View
              style={{
                padding: 40,
                alignItems: 'center',
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: t.border,
                borderRadius: 18,
              }}
            >
              <Text
                style={{
                  color: t.textMute,
                  fontFamily: 'Geist_400Regular',
                  fontSize: 14,
                  textAlign: 'center',
                }}
              >
                {isMaybe
                  ? 'No maybes yet. Swipe up on a film to save it.'
                  : 'No matches yet. Keep swiping.'}
              </Text>
            </View>
          ) : (
            list.map((m, i) => <MatchRow key={m.id + i} movie={m} isMaybe={isMaybe} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MatchRow({ movie, isMaybe }: { movie: Movie; isMaybe: boolean }) {
  const t = useTheme();
  const services = FLICK_SERVICES.filter((s) => movie.services.includes(s.id));
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 14,
        padding: 12,
        backgroundColor: t.surface,
        borderWidth: 1,
        borderColor: t.border,
        borderRadius: 18,
        alignItems: 'center',
      }}
    >
      <View style={{ width: 72 }}>
        <FlickPoster movie={movie} size="sm" />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            fontFamily: 'InstrumentSerif_400Regular',
            fontSize: 20,
            color: t.text,
            letterSpacing: -0.3,
            lineHeight: 22,
          }}
          numberOfLines={2}
        >
          {movie.title}
        </Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
          <Text style={{ fontFamily: 'Geist_400Regular', fontSize: 12, color: t.textDim }}>
            {movie.year}
          </Text>
          <Text style={{ fontSize: 12, color: t.textDim }}>·</Text>
          <Text style={{ fontFamily: 'Geist_400Regular', fontSize: 12, color: t.textDim }}>
            {movie.runtime}m
          </Text>
          <Text style={{ fontSize: 12, color: t.textDim }}>·</Text>
          <Text style={{ fontFamily: 'Geist_400Regular', fontSize: 12, color: t.textDim }}>
            {movie.genres[0]}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 4, marginTop: 8 }}>
          {services.map((s) => (
            <View
              key={s.id}
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                backgroundColor: s.tint,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: 'InstrumentSerif_400Regular',
                  fontSize: 11,
                  color: 'white',
                }}
              >
                {s.mono}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 8,
          backgroundColor: t.surface2,
        }}
      >
        <Text
          style={{
            fontFamily: 'JetBrainsMono_400Regular',
            fontSize: 10,
            color: isMaybe ? t.accent : t.primary,
            letterSpacing: 1,
          }}
        >
          {isMaybe ? '? saved' : `★ ${movie.rating}`}
        </Text>
      </View>
    </View>
  );
}
