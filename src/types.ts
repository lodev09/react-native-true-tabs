import type { ImageSourcePropType, ViewProps } from 'react-native';

export interface TabIcon {
  /**
   * SF Symbol name (iOS).
   */
  sfSymbol?: string;
  /**
   * Image source. Used as fallback when `sfSymbol` is not set (iOS) or as the primary icon (Android).
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
