import type { PropsWithChildren } from 'react';
import type { ImageSourcePropType, ViewProps } from 'react-native';

/**
 * Icon configuration for a tab.
 */
export interface TabIcon {
  /**
   * SF Symbol name (iOS).
   */
  sfSymbol?: string;
  /**
   * Image source (Android).
   */
  source?: ImageSourcePropType;
}

/**
 * Configuration for a single tab.
 */
export interface TabConfig<T extends string = string> {
  /**
   * Unique tab identifier.
   */
  name: T;
  /**
   * Tab label displayed in the bar.
   */
  title: string;
  /**
   * Icon displayed in the tab bar.
   */
  icon?: TabIcon;
  /**
   * Badge text shown on the tab.
   */
  badge?: string;
}

/**
 * Imperative handle exposed by `Provider` via `ref`.
 */
export interface TrueTabsRef<T extends string = string> {
  /**
   * Currently selected tab name.
   */
  selectedTab: T;
  /**
   * Programmatically switch to a tab.
   */
  setSelectedTab: (tab: T) => void;
}

/**
 * Props for the native tab bar component.
 */
export interface BarProps extends ViewProps {
  /**
   * Makes the tab bar translucent (iOS only).
   */
  translucent?: boolean;
  /**
   * Tab bar background color.
   */
  tintColor?: string;
  /**
   * Selected tab tint color.
   */
  activeTintColor?: string;
}

/**
 * Props for a tab screen.
 */
export interface ScreenProps<T extends string> extends PropsWithChildren {
  /**
   * Tab name this screen is associated with.
   */
  name: T;
}

/**
 * Props for the tab provider.
 */
export interface ProviderProps<T extends string> extends PropsWithChildren {
  /**
   * Tab to select on first render. Defaults to the first tab.
   */
  initialTab?: T;
}

export interface TrueTabsState<T extends string> {
  selectedTab: T;
  setSelectedTab: (tab: T) => void;
  tabs: TabConfig<T>[];
}
