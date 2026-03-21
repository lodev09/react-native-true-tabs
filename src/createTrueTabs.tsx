import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import type { ViewProps } from 'react-native';
import NativeTrueTabsView from './fabric/TrueTabsNativeComponent';
import type { TabConfig } from './types';

interface ProviderProps<T extends string> extends PropsWithChildren {
  initialTab?: T;
}

interface BarProps extends ViewProps {
  translucent?: boolean;
}

interface ScreenProps<T extends string> extends PropsWithChildren {
  name: T;
}

interface TrueTabsState<T extends string> {
  selectedTab: T;
  setSelectedTab: (tab: T) => void;
  tabs: TabConfig<T>[];
}

export const createTrueTabs = <const T extends string>(
  tabs: TabConfig<T>[]
) => {
  const Context = createContext<TrueTabsState<T> | null>(null);

  const useTabsContext = (): TrueTabsState<T> => {
    const ctx = useContext(Context);
    if (!ctx) {
      throw new Error('TrueTabs components must be used within Provider');
    }
    return ctx;
  };

  const Provider = (props: ProviderProps<T>) => {
    const { initialTab, children } = props;
    const [selectedTab, setSelectedTab] = useState<T>(
      initialTab ?? tabs[0]!.name
    );

    const value = useMemo(
      () => ({ selectedTab, setSelectedTab, tabs }),
      [selectedTab]
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const Bar = (props: BarProps) => {
    const { translucent, ...rest } = props;
    const { selectedTab, setSelectedTab } = useTabsContext();

    const selectedIndex = useMemo(
      () => tabs.findIndex((t) => t.name === selectedTab),
      [selectedTab]
    );

    const items = useMemo(
      () =>
        tabs.map((tab) => ({
          title: tab.title,
          sfSymbol: tab.icon?.sfSymbol,
          badge: tab.badge,
        })),
      []
    );

    const handleTabSelect = useCallback(
      (event: { nativeEvent: { index: number } }) => {
        const tab = tabs[event.nativeEvent.index];
        if (tab) {
          setSelectedTab(tab.name);
        }
      },
      [setSelectedTab]
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
  };

  const Screen = (props: ScreenProps<T>) => {
    const { name, children } = props;
    const { selectedTab } = useTabsContext();

    if (selectedTab !== name) {
      return null;
    }

    return <>{children}</>;
  };

  return { Provider, Bar, Screen };
};
