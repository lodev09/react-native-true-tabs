import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
  type Ref,
} from 'react';
import { Image, type ViewProps } from 'react-native';
import NativeTrueTabsView from './fabric/TrueTabsNativeComponent';
import type { TabConfig } from './types';

function resolveIconUri(icon?: TabConfig['icon']): string | undefined {
  const source = icon?.source;
  if (!source) return undefined;

  if (typeof source === 'number') {
    return Image.resolveAssetSource(source)?.uri;
  }

  if (typeof source === 'object' && !Array.isArray(source) && 'uri' in source) {
    return source.uri ?? undefined;
  }

  return undefined;
}

export interface TrueTabsRef<T extends string = string> {
  selectedTab: T;
  setSelectedTab: (tab: T) => void;
}

interface BarProps extends ViewProps {
  translucent?: boolean;
  tintColor?: string;
  activeTintColor?: string;
}

interface ScreenProps<T extends string> extends PropsWithChildren {
  name: T;
}

interface ProviderProps<T extends string> extends PropsWithChildren {
  initialTab?: T;
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
    const { translucent, tintColor, activeTintColor, ...rest } = props;
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
          iconUri: resolveIconUri(tab.icon),
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
        tintColor={tintColor}
        activeTintColor={activeTintColor}
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

  const useRef_ = () => useRef<TrueTabsRef<T>>(null);

  return { Provider, Bar, Screen, useTabs, useRef: useRef_ };
};
