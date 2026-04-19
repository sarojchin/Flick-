import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import {
  useFonts as useInstrumentSerif,
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from '@expo-google-fonts/instrument-serif';
import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from '@expo-google-fonts/geist';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
} from '@expo-google-fonts/jetbrains-mono';

import { ThemeProvider, useTheme } from '@/lib/ThemeContext';
import { RoomStateProvider } from '@/lib/RoomState';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootStack() {
  const t = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: t.bg },
        animation: 'fade',
      }}
    />
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useInstrumentSerif({
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#05050d' }}>
      <ThemeProvider>
        <RoomStateProvider>
          <View style={{ flex: 1 }}>
            <StatusBar style="light" />
            <RootStack />
          </View>
        </RoomStateProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
