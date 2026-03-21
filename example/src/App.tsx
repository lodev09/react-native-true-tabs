import { useRef } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { createTrueTabs } from 'react-native-true-tabs';
import { TrueSheet } from '@lodev09/react-native-true-sheet';

type TabName = 'home' | 'search' | 'settings';

const Tabs = createTrueTabs<TabName>([
  { name: 'home', title: 'Home', icon: { sfSymbol: 'house.fill' } },
  { name: 'search', title: 'Search', icon: { sfSymbol: 'magnifyingglass' } },
  { name: 'settings', title: 'Settings', icon: { sfSymbol: 'gearshape.fill' } },
]);

const HOME_ITEMS = Array.from({ length: 50 }, (_, i) => ({
  id: String(i),
  title: `Item ${i + 1}`,
}));

function HomeScreen() {
  return (
    <FlatList
      data={HOME_ITEMS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>{item.title}</Text>
        </View>
      )}
    />
  );
}

function SearchScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Search</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Settings</Text>
    </View>
  );
}

function SheetFooter() {
  return <Tabs.Bar style={styles.tabBar} />;
}

export default function App() {
  const sheetRef = useRef<TrueSheet>(null);

  return (
    <Tabs.Provider>
      <View style={styles.container}>
        <TrueSheet
          ref={sheetRef}
          detents={[0.5, 1]}
          initialDetentIndex={0}
          dismissible={false}
          footer={<SheetFooter />}
          grabber
          scrollable
          scrollableOptions={{ bottomScrollEdgeEffect: 'automatic' }}
        >
          <Tabs.Screen name="home">
            <HomeScreen />
          </Tabs.Screen>
          <Tabs.Screen name="search">
            <SearchScreen />
          </Tabs.Screen>
          <Tabs.Screen name="settings">
            <SettingsScreen />
          </Tabs.Screen>
        </TrueSheet>
      </View>
    </Tabs.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  screen: {
    paddingTop: 50,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
  },
  tabBar: {
    height: 80,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  listItem: {
    padding: 16,
    backgroundColor: '#f2f2f7',
    borderRadius: 10,
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 17,
  },
});
