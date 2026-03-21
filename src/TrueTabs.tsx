import { useCallback, useMemo } from 'react';
import type { ViewProps } from 'react-native';
import NativeTrueTabsView from './fabric/TrueTabsNativeComponent';
import { useTrueTabs } from './TrueTabsContext';
import type { TabConfig } from './types';

interface TrueTabsProps<T extends string> extends ViewProps {
  tabs: TabConfig<T>[];
  translucent?: boolean;
}

export function TrueTabs<T extends string>({
  tabs,
  translucent,
  ...rest
}: TrueTabsProps<T>) {
  const { selectedTab, setSelectedTab } = useTrueTabs();

  const selectedIndex = useMemo(
    () => tabs.findIndex((t) => t.name === selectedTab),
    [tabs, selectedTab]
  );

  const items = useMemo(
    () =>
      tabs.map((tab) => ({
        title: tab.title,
        sfSymbol: tab.icon?.sfSymbol,
        badge: tab.badge,
      })),
    [tabs]
  );

  const handleTabSelect = useCallback(
    (event: { nativeEvent: { index: number } }) => {
      const tab = tabs[event.nativeEvent.index];
      if (tab) {
        setSelectedTab(tab.name);
      }
    },
    [tabs, setSelectedTab]
  );

  return (
    <NativeTrueTabsView
      {...rest}
      items={items}
      selectedIndex={selectedIndex}
      onTabSelect={handleTabSelect}
      translucent={translucent}
    />
  );
}
