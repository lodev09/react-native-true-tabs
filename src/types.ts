export interface TabIcon {
  sfSymbol?: string;
}

export interface TabConfig<T extends string = string> {
  name: T;
  title: string;
  icon?: TabIcon;
  badge?: string;
}
