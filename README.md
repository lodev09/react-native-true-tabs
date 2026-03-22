# @lodev09/react-native-true-tabs

Decoupled native tab bars for React Native. Uses `UITabBar` on iOS and Material `TabLayout` on Android via Fabric.

## Installation

```sh
yarn add @lodev09/react-native-true-tabs
cd ios && pod install
```

## Usage

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
    <Tabs.Provider>
      <Tabs.Bar style={{ height: 80 }} />
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

## API

### `createTrueTabs<T>(tabs)`

Factory that returns `{ Provider, Bar, Screen, useTabs, useRef }`.

#### `TabConfig`

| Prop | Type | Description |
|------|------|-------------|
| `name` | `T` | Unique tab identifier |
| `title` | `string` | Tab label |
| `icon` | `TabIcon` | Optional icon config |
| `badge` | `string` | Optional badge text |

#### `TabIcon`

| Prop | Type | Description |
|------|------|-------------|
| `sfSymbol` | `string` | SF Symbol name (iOS) |
| `source` | `ImageSourcePropType` | Image source (Android) |

### `Provider`

Wraps your tab content. Accepts `initialTab` and a `ref` for imperative control.

### `Bar`

The native tab bar component.

| Prop | Type | Description |
|------|------|-------------|
| `translucent` | `boolean` | Translucent tab bar (iOS) |
| `tintColor` | `string` | Tab bar background color |
| `activeTintColor` | `string` | Selected tab color |

Also accepts all `ViewProps`.

### `Screen`

Renders children only when its `name` matches the selected tab.

### `useTabs()`

Hook for nested components. Returns `{ selectedTab, setSelectedTab }`.

```tsx
const { selectedTab, setSelectedTab } = Tabs.useTabs();
setSelectedTab('settings');
```

### `useRef()`

Returns a typed ref for the Provider. Use for imperative control outside the provider tree.

```tsx
const tabsRef = Tabs.useRef();

<Tabs.Provider ref={tabsRef}>...</Tabs.Provider>

tabsRef.current?.setSelectedTab('settings');
```

## Contributing

See the [contributing guide](CONTRIBUTING.md).

## License

MIT
