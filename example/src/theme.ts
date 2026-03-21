import { useColorScheme } from 'react-native';

const colors = {
  light: {
    background: '#ffffff',
    secondaryBackground: '#f2f2f7',
    tertiaryBackground: '#e5e5ea',
    text: '#000000',
    secondaryText: '#8e8e93',
    accent: '#007AFF',
    landing: '#4A90D9',
    landingText: '#ffffff',
  },
  dark: {
    background: '#2c2c2e',
    secondaryBackground: '#3a3a3c',
    tertiaryBackground: '#3a3a3c',
    text: '#ffffff',
    secondaryText: '#8e8e93',
    accent: '#0A84FF',
    landing: '#2C3E6B',
    landingText: '#ffffffcc',
  },
};

export type Theme = (typeof colors)['light'];

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return colors[scheme === 'dark' ? 'dark' : 'light'];
}
