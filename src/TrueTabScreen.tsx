import { type PropsWithChildren } from 'react';
import { useTrueTabs } from './TrueTabsContext';

interface TrueTabScreenProps<T extends string> extends PropsWithChildren {
  name: T;
}

export function TrueTabScreen<T extends string>({
  name,
  children,
}: TrueTabScreenProps<T>) {
  const { selectedTab } = useTrueTabs();

  if (selectedTab !== name) {
    return null;
  }

  return <>{children}</>;
}
