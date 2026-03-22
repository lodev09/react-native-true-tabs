import type { PropsWithChildren } from 'react';
import type { ImageSourcePropType, ViewProps } from 'react-native';

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

export interface ScreenProps<T extends string> extends PropsWithChildren {
  /**
   * Tab name this screen is associated with.
   */
  name: T;
}

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
