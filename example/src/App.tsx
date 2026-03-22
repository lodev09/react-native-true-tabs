import { useRef } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { type TrueTabsRef } from '@lodev09/react-native-true-tabs';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { useTheme } from './theme';
import { Tabs, type TabName } from './tabs';
import { SheetFooter } from './components/SheetFooter';
import { Button } from './components/Button';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export default function App() {
  const sheetRef = useRef<TrueSheet>(null);
  const tabsRef = useRef<TrueTabsRef<TabName>>(null);
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
      </View>
      <Tabs.Provider ref={tabsRef}>
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
});
