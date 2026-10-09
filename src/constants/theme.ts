/**
 * PayCom Rig Configurator Theme
 * Cyberpunk-inspired dark theme with cyan/neon accents
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#dfe2eb',
    background: '#10141a',
    backgroundElement: '#1c2026',
    backgroundSelected: '#262a31',
    textSecondary: '#b9cacb',
  },
  dark: {
    text: '#dfe2eb',
    background: '#10141a',
    backgroundElement: '#1c2026',
    backgroundSelected: '#262a31',
    textSecondary: '#b9cacb',
  },
} as const;

// PayCom Design System Colors
export const PayComColors = {
  // Primary
  primary: '#dbfcff',
  primaryContainer: '#00f0ff',
  onPrimaryContainer: '#006970',
  onPrimary: '#00363a',

  // Secondary
  secondary: '#aec6ff',
  secondaryContainer: '#508eff',
  onSecondaryContainer: '#00275e',

  // Tertiary
  tertiary: '#fff3f3',
  tertiaryContainer: '#ffcdd1',

  // Error
  error: '#ffb4ab',
  errorContainer: '#93000a',
  onError: '#690005',
  onErrorContainer: '#ffdad6',

  // Surface
  surface: '#10141a',
  surfaceDim: '#10141a',
  surfaceBright: '#353940',
  surfaceContainer: '#1c2026',
  surfaceContainerLow: '#181c22',
  surfaceContainerHigh: '#262a31',
  surfaceContainerHighest: '#31353c',
  surfaceContainerLowest: '#0a0e14',
  surfaceVariant: '#31353c',

  // On Surface
  onSurface: '#dfe2eb',
  onSurfaceVariant: '#b9cacb',
  onBackground: '#dfe2eb',
  background: '#10141a',

  // Outline
  outline: '#849495',
  outlineVariant: '#3b494b',

  // Inverse
  inverseSurface: '#dfe2eb',
  inverseOnSurface: '#2d3137',
  inversePrimary: '#006970',

  // Fixed
  primaryFixed: '#7df4ff',
  primaryFixedDim: '#00dbe9',
  secondaryFixed: '#d8e2ff',
  secondaryFixedDim: '#aec6ff',
  tertiaryFixed: '#ffd9dc',
  tertiaryFixedDim: '#ffb2ba',
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 1400;
