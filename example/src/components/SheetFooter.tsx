import { Platform, StyleSheet } from 'react-native';
import { Tabs } from '../tabs';
import { useTheme } from '../theme';

const TAB_BAR_HEIGHT = 90;

export function SheetFooter() {
  const c = useTheme();
  return (
    <Tabs.Bar
      style={styles.tabBar}
      tintColor={Platform.select({ android: c.secondaryBackground })}
      activeTintColor="#FF9500"
    />
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: TAB_BAR_HEIGHT,
  },
});
