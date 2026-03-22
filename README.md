# React Native TrueTabs

Decoupled native tab bars for React Native. Uses `UITabBar` on iOS and Material `TabLayout` on Android via Fabric.

## Installation

```sh
yarn add @lodev09/react-native-true-tabs
cd ios && pod install
```

## Usage

### With `createTrueTabs`

The factory creates a scoped set of components with built-in state management.

```tsx
import { createTrueTabs } from '@lodev09/react-native-true-tabs';

type TabName = 'home' | 'search' | 'settings';

const Tabs = createTrueTabs<TabName>([
  { name: 'home', title: 'Home', icon: { sfSymbol: 'house.fill' } },
  { name: 'search', title: 'Search', icon: { sfSymbol: 'magnifyingglass' } },
  { name: 'settings', title: 'Settings', icon: { sfSymbol: 'gearshape.fill' } },
]);

export default function App() {
  return (
    <Tabs.Provider initialTab="home" hiddenTabs={['search']}>
      <Tabs.Bar style={{ height: 80 }} activeTintColor="#FF9500" />
      <Tabs.Screen name="home">
        <HomeScreen />
      </Tabs.Screen>
      <Tabs.Screen name="search">
        <SearchScreen />
      </Tabs.Screen>
      <Tabs.Screen name="settings">
        <SettingsScreen />
      </Tabs.Screen>
    </Tabs.Provider>
  );
}
```

### Standalone `TrueTabs`

Use `TrueTabs` directly to manage tab state yourself.

```tsx
import { useState } from 'react';
import { TrueTabs, type TabConfig } from '@lodev09/react-native-true-tabs';

type TabName = 'home' | 'search' | 'settings';

const tabs: TabConfig<TabName>[] = [
  { name: 'home', title: 'Home', icon: { sfSymbol: 'house.fill' } },
  { name: 'search', title: 'Search', icon: { sfSymbol: 'magnifyingglass' } },
  { name: 'settings', title: 'Settings', icon: { sfSymbol: 'gearshape.fill' } },
];

function MyTabs() {
  const [selectedTab, setSelectedTab] = useState<TabName>('home');

  return (
    <TrueTabs
      tabs={tabs}
      selectedTab={selectedTab}
      onTabSelect={setSelectedTab}
      style={{ height: 80 }}
      activeTintColor="#FF9500"
    />
  );
}
```

## API

### `TabConfig`

| Prop | Type | Description |
|------|------|-------------|
| `name` | `T` | Unique tab identifier |
| `title` | `string` | Tab label |
| `icon` | `TabIcon` | Optional icon config |
| `badge` | `string` | Optional badge text |

### `TabIcon`

| Prop | Type | Description |
|------|------|-------------|
| `sfSymbol` | `string` | SF Symbol name (iOS) |
| `source` | `ImageSourcePropType` | Image source. Fallback when `sfSymbol` is not set on iOS, primary icon on Android. |

### `createTrueTabs<T>(tabs)`

Factory that returns `{ Provider, Bar, Screen, useTabs }`.

#### `Provider`

Wraps your tab content. Accepts a `ref` for imperative control via `TrueTabsRef`.

| Prop | Type | Description |
|------|------|-------------|
| `initialTab` | `T` | Tab to select on first render. Defaults to the first tab. |
| `hiddenTabs` | `T[]` | Tab names to hide from the tab bar. Auto-selects first visible tab if the active tab is hidden. |

#### `Bar`

The native tab bar. Accepts all `ViewProps` plus:

| Prop | Type | Description |
|------|------|-------------|
| `translucent` | `boolean` | Translucent tab bar (iOS) |
| `tintColor` | `string` | Tab bar background color |
| `activeTintColor` | `string` | Selected tab color |

#### `Screen`

Renders children only when its `name` matches the selected tab.

#### `useTabs()`

Returns `{ selectedTab, setSelectedTab, hiddenTabs }`.

```tsx
const { selectedTab, setSelectedTab } = Tabs.useTabs();
```

### `TrueTabs`

Standalone native tab bar. Accepts all `ViewProps` plus:

| Prop | Type | Description |
|------|------|-------------|
| `tabs` | `TabConfig<T>[]` | Tab configuration array |
| `selectedTab` | `T` | Currently selected tab name |
| `onTabSelect` | `(tab: T) => void` | Called when a tab is selected |
| `translucent` | `boolean` | Translucent tab bar (iOS) |
| `tintColor` | `string` | Tab bar background color |
| `activeTintColor` | `string` | Selected tab color |

### `TrueTabsRef`

Imperative handle from `Provider` ref.

```tsx
const tabsRef = useRef<TrueTabsRef<TabName>>(null);

<Tabs.Provider ref={tabsRef}>...</Tabs.Provider>

tabsRef.current?.setSelectedTab('settings');
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

[MIT](LICENSE)

---

Made with ❤️ by [@lodev09](http://linkedin.com/in/lodev09/)
