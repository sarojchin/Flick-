import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { useRoom } from '@/lib/RoomState';
import { useTheme } from '@/lib/ThemeContext';

export default function Index() {
  const { hydrated, onboarded } = useRoom();
  const t = useTheme();

  if (!hydrated) {
    return <View style={{ flex: 1, backgroundColor: t.bg }} />;
  }
  return <Redirect href={onboarded ? '/landing' : '/onboarding'} />;
}
