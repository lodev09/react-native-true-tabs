import { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useColorScheme,
  ScrollView,
  Platform,
} from 'react-native';
import { createTrueTabs } from 'react-native-true-tabs';
import { TrueSheet } from '@lodev09/react-native-true-sheet';

type TabName = 'home' | 'search' | 'settings';

const Tabs = createTrueTabs<TabName>([
  { name: 'home', title: 'Home', icon: { sfSymbol: 'house.fill' } },
  { name: 'search', title: 'Search', icon: { sfSymbol: 'magnifyingglass' } },
  { name: 'settings', title: 'Settings', icon: { sfSymbol: 'gearshape.fill' } },
]);

const colors = {
  light: {
    background: '#ffffff',
    secondaryBackground: '#f2f2f7',
    tertiaryBackground: '#e5e5ea',
    text: '#000000',
    secondaryText: '#8e8e93',
    accent: '#007AFF',
    landing: '#4A90D9',
    landingText: '#ffffff',
  },
  dark: {
    background: '#2c2c2e',
    secondaryBackground: '#3a3a3c',
    tertiaryBackground: '#3a3a3c',
    text: '#ffffff',
    secondaryText: '#8e8e93',
    accent: '#0A84FF',
    landing: '#2C3E6B',
    landingText: '#ffffffcc',
  },
};

const TAB_BAR_HEIGHT = 80;

function useTheme() {
  const scheme = useColorScheme() ?? 'light';
  return colors[scheme];
}

const CONVERSATIONS = [
  {
    id: '1',
    name: 'Alice',
    message: 'Hey! Are we still on for lunch?',
    time: '2m ago',
  },
  {
    id: '2',
    name: 'Bob',
    message: 'Check out this new library I found',
    time: '15m ago',
  },
  {
    id: '3',
    name: 'Carol',
    message: 'The PR looks good, merging now',
    time: '1h ago',
  },
  { id: '4', name: 'Dave', message: 'Meeting moved to 3pm', time: '2h ago' },
  {
    id: '5',
    name: 'Eve',
    message: 'Can you review my latest commit?',
    time: '3h ago',
  },
  {
    id: '6',
    name: 'Frank',
    message: 'Thanks for the help earlier!',
    time: '5h ago',
  },
  {
    id: '7',
    name: 'Grace',
    message: 'Deployed v2.1 to staging',
    time: '6h ago',
  },
  {
    id: '8',
    name: 'Hank',
    message: 'New designs are ready for review',
    time: '8h ago',
  },
  {
    id: '9',
    name: 'Ivy',
    message: 'Sprint retro notes attached',
    time: '1d ago',
  },
  { id: '10', name: 'Jack', message: 'Happy Friday everyone!', time: '1d ago' },
];

function HomeScreen() {
  const c = useTheme();

  return (
    <FlatList
      data={CONVERSATIONS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[styles.list, { paddingBottom: TAB_BAR_HEIGHT }]}
      renderItem={({ item }) => (
        <View
          style={[styles.listItem, { backgroundColor: c.secondaryBackground }]}
        >
          <View style={[styles.avatar, { backgroundColor: c.accent }]}>
            <Text style={styles.avatarText}>{item.name[0]}</Text>
          </View>
          <View style={styles.listItemContent}>
            <View style={styles.listItemHeader}>
              <Text style={[styles.listItemName, { color: c.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.listItemTime, { color: c.secondaryText }]}>
                {item.time}
              </Text>
            </View>
            <Text
              style={[styles.listItemMessage, { color: c.secondaryText }]}
              numberOfLines={1}
            >
              {item.message}
            </Text>
          </View>
        </View>
      )}
    />
  );
}

const SEARCH_CATEGORIES = [
  { id: '1', title: 'Photos', icon: 'photo.fill', count: 128 },
  { id: '2', title: 'Links', icon: 'link', count: 47 },
  { id: '3', title: 'Documents', icon: 'doc.fill', count: 23 },
  { id: '4', title: 'Audio', icon: 'waveform', count: 12 },
];

function SearchScreen() {
  const c = useTheme();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.screenContent,
        { paddingBottom: TAB_BAR_HEIGHT },
      ]}
    >
      <View
        style={[styles.searchBar, { backgroundColor: c.secondaryBackground }]}
      >
        <Text style={[styles.searchPlaceholder, { color: c.secondaryText }]}>
          Search messages...
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: c.secondaryText }]}>
        Categories
      </Text>
      <View style={styles.grid}>
        {SEARCH_CATEGORIES.map((cat) => (
          <View
            key={cat.id}
            style={[
              styles.gridItem,
              { backgroundColor: c.secondaryBackground },
            ]}
          >
            <Text style={[styles.gridTitle, { color: c.text }]}>
              {cat.title}
            </Text>
            <Text style={[styles.gridCount, { color: c.secondaryText }]}>
              {cat.count} items
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: c.secondaryText }]}>
        Recent Searches
      </Text>
      {['react-native-true-tabs', 'deployment guide', 'API docs'].map(
        (term) => (
          <View
            key={term}
            style={[
              styles.recentItem,
              { borderBottomColor: c.tertiaryBackground },
            ]}
          >
            <Text style={[styles.recentText, { color: c.text }]}>{term}</Text>
          </View>
        )
      )}
    </ScrollView>
  );
}

const SETTINGS_SECTIONS = [
  {
    title: 'General',
    items: ['Notifications', 'Appearance', 'Language'],
  },
  {
    title: 'Privacy',
    items: ['Blocked Users', 'Data & Storage', 'Two-Factor Auth'],
  },
  {
    title: 'About',
    items: ['Version 1.0.0', 'Terms of Service', 'Privacy Policy'],
  },
];

function SettingsScreen() {
  const c = useTheme();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.screenContent,
        { paddingBottom: TAB_BAR_HEIGHT },
      ]}
    >
      {SETTINGS_SECTIONS.map((section) => (
        <View key={section.title}>
          <Text style={[styles.sectionTitle, { color: c.secondaryText }]}>
            {section.title}
          </Text>
          <View
            style={[
              styles.settingsGroup,
              { backgroundColor: c.secondaryBackground },
            ]}
          >
            {section.items.map((item, i) => (
              <View
                key={item}
                style={[
                  styles.settingsItem,
                  i < section.items.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: c.tertiaryBackground,
                  },
                ]}
              >
                <Text style={[styles.settingsText, { color: c.text }]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function SheetFooter() {
  const c = useTheme();
  return (
    <Tabs.Bar
      style={[
        styles.tabBar,
        {
          backgroundColor: Platform.select({ android: c.secondaryBackground }),
        },
      ]}
    />
  );
}

export default function App() {
  const sheetRef = useRef<TrueSheet>(null);
  const c = useTheme();

  return (
    <Tabs.Provider>
      <View style={[styles.container, { backgroundColor: c.landing }]}>
        <View style={styles.landing}>
          <Text style={[styles.landingTitle, { color: c.landingText }]}>
            TrueTabs
          </Text>
          <Text style={[styles.landingSubtitle, { color: c.landingText }]}>
            Native tabs, powered by a sheet
          </Text>
        </View>
        <TrueSheet
          ref={sheetRef}
          detents={[0.5, 1]}
          initialDetentIndex={0}
          dimmedDetentIndex={1}
          dismissible={false}
          footer={<SheetFooter />}
          backgroundColor={Platform.OS === 'android' ? c.background : undefined}
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
  landing: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
  },
  landingTitle: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  landingSubtitle: {
    fontSize: 17,
    marginTop: 8,
  },
  tabBar: {
    height: TAB_BAR_HEIGHT,
  },
  screenContent: {
    padding: 16,
  },

  // Home
  list: {
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  listItemTime: {
    fontSize: 13,
  },
  listItemMessage: {
    fontSize: 15,
  },

  // Search
  searchBar: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 24,
  },
  searchPlaceholder: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  gridItem: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  gridCount: {
    fontSize: 13,
  },
  recentItem: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  recentText: {
    fontSize: 16,
  },

  // Settings
  settingsGroup: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  settingsItem: {
    padding: 14,
    paddingHorizontal: 16,
  },
  settingsText: {
    fontSize: 16,
  },
});
