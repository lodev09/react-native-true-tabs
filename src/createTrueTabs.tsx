import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type PropsWithChildren,
  type Ref,
} from 'react';
import { TrueTabs } from './TrueTabs';
import type { BarProps, TabConfig, TrueTabsRef } from './types';

interface ProviderProps<T extends string> extends PropsWithChildren {
  initialTab?: T;
  hiddenTabs?: T[];
}

interface TrueTabsState<T extends string> {
  selectedTab: T;
  setSelectedTab: (tab: T) => void;
  tabs: TabConfig<T>[];
  hiddenTabs: T[];
}

interface ScreenProps<T extends string> extends PropsWithChildren {
  name: T;
}

/**
 * Creates a set of tab components and hooks scoped to a specific tab configuration.
 *
 * @example
 * const Tabs = createTrueTabs([
 *   { name: 'home', title: 'Home', icon: { sfSymbol: 'house.fill' } },
 *   { name: 'search', title: 'Search', icon: { sfSymbol: 'magnifyingglass' } },
 * ]);
 */
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

  const Provider = forwardRef(function Provider(
    props: ProviderProps<T>,
    ref: Ref<TrueTabsRef<T>>
  ) {
    const { initialTab, hiddenTabs = [], children } = props;
    const [selectedTab, setSelectedTab] = useState<T>(
      initialTab ?? tabs[0]!.name
    );

    useEffect(() => {
      if (hiddenTabs.includes(selectedTab)) {
        const firstVisible = tabs.find((t) => !hiddenTabs.includes(t.name));
        if (firstVisible) {
          setSelectedTab(firstVisible.name);
        }
      }
    }, [hiddenTabs, selectedTab]);

    const value = useMemo(
      () => ({ selectedTab, setSelectedTab, tabs, hiddenTabs }),
      [selectedTab, hiddenTabs]
    );

    useImperativeHandle(ref, () => ({ selectedTab, setSelectedTab }), [
      selectedTab,
    ]);

    return <Context.Provider value={value}>{children}</Context.Provider>;
  });

  const Bar = (props: BarProps) => {
    const { selectedTab, setSelectedTab, hiddenTabs } = useTabsContext();

    const visibleTabs = useMemo(
      () =>
        hiddenTabs.length
          ? tabs.filter((t) => !hiddenTabs.includes(t.name))
          : tabs,
      [hiddenTabs]
    );

    return (
      <TrueTabs
        {...props}
        tabs={visibleTabs}
        selectedTab={selectedTab}
        onTabSelect={setSelectedTab}
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

  const useTabs = () => {
    const { selectedTab, setSelectedTab, hiddenTabs } = useTabsContext();
    return { selectedTab, setSelectedTab, hiddenTabs };
  };

  return { Provider, Bar, Screen, useTabs };
};
