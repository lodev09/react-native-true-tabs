import type { ImageSourcePropType } from 'react-native';

export interface TabIcon {
  sfSymbol?: string;
  source?: ImageSourcePropType;
}

export interface TabConfig<T extends string = string> {
  name: T;
  title: string;
  icon?: TabIcon;
  badge?: string;
}
