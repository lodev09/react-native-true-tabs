import { Component, createRef } from 'react';
import { Image } from 'react-native';
import NativeTrueTabsView from './fabric/TrueTabsNativeComponent';
import type { BarProps, TabConfig, TabIcon } from './types';

function resolveIconUri(icon?: TabIcon): string | undefined {
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

export interface TrueTabsProps<T extends string = string> extends BarProps {
  tabs: TabConfig<T>[];
  selectedTab: T;
  onTabSelect?: (tab: T) => void;
}

export class TrueTabs<T extends string = string> extends Component<
  TrueTabsProps<T>
> {
  private readonly nativeRef = createRef<typeof NativeTrueTabsView>();
  private cachedItems: ReturnType<TrueTabs<T>['buildItems']> | undefined;
  private prevTabs: TabConfig<T>[] | undefined;

  private buildItems() {
    return this.props.tabs.map((tab) => ({
      title: tab.title,
      sfSymbol: tab.icon?.sfSymbol,
      iconUri: resolveIconUri(tab.icon),
      badge: tab.badge,
    }));
  }

  private getItems() {
    if (this.props.tabs !== this.prevTabs) {
      this.prevTabs = this.props.tabs;
      this.cachedItems = this.buildItems();
    }
    return this.cachedItems!;
  }

  private handleTabSelect = (event: { nativeEvent: { index: number } }) => {
    const tab = this.props.tabs[event.nativeEvent.index];
    if (tab) {
      this.props.onTabSelect?.(tab.name);
    }
  };

  render() {
    const {
      tabs,
      selectedTab,
      translucent,
      tintColor,
      activeTintColor,
      ...rest
    } = this.props;

    const selectedIndex = tabs.findIndex((t) => t.name === selectedTab);

    return (
      <NativeTrueTabsView
        {...rest}
        ref={this.nativeRef as any}
        items={this.getItems()}
        selectedIndex={selectedIndex}
        onTabSelect={this.handleTabSelect}
        translucent={translucent}
        tintColor={tintColor}
        activeTintColor={activeTintColor}
      />
    );
  }
}
