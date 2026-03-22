import {
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useMemo,
  useState,
  type Ref,
} from 'react';
import { TrueTabs } from './TrueTabs';
import type {
  BarProps,
  ProviderProps,
  ScreenProps,
  TabConfig,
  TrueTabsRef,
  TrueTabsState,
} from './types';

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
    const { initialTab, children } = props;
    const [selectedTab, setSelectedTab] = useState<T>(
      initialTab ?? tabs[0]!.name
    );

    const value = useMemo(
      () => ({ selectedTab, setSelectedTab, tabs }),
      [selectedTab]
    );

    useImperativeHandle(ref, () => ({ selectedTab, setSelectedTab }), [
      selectedTab,
    ]);

    return <Context.Provider value={value}>{children}</Context.Provider>;
  });

  const Bar = (props: BarProps) => {
    const { selectedTab, setSelectedTab } = useTabsContext();

    return (
      <TrueTabs
        {...props}
        tabs={tabs}
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
    const { selectedTab, setSelectedTab } = useTabsContext();
    return { selectedTab, setSelectedTab };
  };

  return { Provider, Bar, Screen, useTabs };
};
