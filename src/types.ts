import type { ImageSourcePropType } from 'react-native';

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
