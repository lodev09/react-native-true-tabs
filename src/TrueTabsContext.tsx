import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import type { TabConfig } from './types';

export interface TrueTabsState {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  tabs: TabConfig[];
}

const TrueTabsContext = createContext<TrueTabsState | null>(null);

interface TrueTabsProviderProps<T extends string> extends PropsWithChildren {
  tabs: TabConfig<T>[];
  initialTab?: T;
}

export function TrueTabsProvider<T extends string>({
  tabs,
  initialTab,
  children,
}: TrueTabsProviderProps<T>) {
  const [selectedTab, setSelectedTab] = useState<string>(
    initialTab ?? tabs[0]!.name
  );

  const value: TrueTabsState = useMemo(
    () => ({
      selectedTab,
      setSelectedTab,
      tabs,
    }),
    [selectedTab, setSelectedTab, tabs]
  );

  return (
    <TrueTabsContext.Provider value={value}>
      {children}
    </TrueTabsContext.Provider>
  );
}

export function useTrueTabs(): TrueTabsState {
  const ctx = useContext(TrueTabsContext);
  if (!ctx) {
    throw new Error('useTrueTabs must be used within a TrueTabsProvider');
  }
  return ctx;
}
