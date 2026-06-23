import { useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, TextInput } from 'react-native';
import { type TrueTabsRef } from '@lodev09/react-native-true-tabs';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { TAB_BAR_HEIGHT, useTheme } from './theme';
import { Tabs, type TabName } from './tabs';
import { Button } from './components/Button';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export default function App() {
  const sheetRef = useRef<TrueSheet>(null);
  const tabsRef = useRef<TrueTabsRef<TabName>>(null);
  const [hideSearch, setHideSearch] = useState(false);
  const c = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: c.landing }]}>
      <View style={styles.landing}>
        <Text style={[styles.landingTitle, { color: c.landingText }]}>
          TrueTabs
        </Text>
        <Text style={[styles.landingSubtitle, { color: c.landingText }]}>
          Native tabs, powered by a sheet
        </Text>
        <Button
          label="Go to Settings"
          onPress={() => tabsRef.current?.setSelectedTab('settings')}
        />
        <Button
          label={hideSearch ? 'Show Search Tab' : 'Hide Search Tab'}
          onPress={() => setHideSearch((v) => !v)}
        />
      </View>
      <Tabs.Provider ref={tabsRef} hiddenTabs={hideSearch ? ['search'] : []}>
        <TrueSheet
          ref={sheetRef}
          detents={[0.5, 1]}
          initialDetentIndex={0}
          dimmedDetentIndex={1}
          dismissible={false}
          header={
            <View style={styles.header}>
              <TextInput
                style={[
                  styles.search,
                  {
                    backgroundColor: c.secondaryBackground,
                    color: c.text,
                  },
                ]}
                placeholder="Search"
                placeholderTextColor={c.secondaryText}
              />
            </View>
          }
          footer={
            <Tabs.Bar
              style={styles.tabBar}
              barTintColor={Platform.select({ android: c.background })}
              activeTintColor="#FF9500"
              activeIndicatorColor={Platform.select({
                android: 'rgba(255, 149, 0, 0.2)',
              })}
            />
          }
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
      </Tabs.Provider>
    </View>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  search: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});
