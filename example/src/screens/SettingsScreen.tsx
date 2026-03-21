import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme';

const TAB_BAR_HEIGHT = 90;

const SECTIONS = [
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

export function SettingsScreen() {
  const c = useTheme();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingBottom: TAB_BAR_HEIGHT },
      ]}
    >
      {SECTIONS.map((section) => (
        <View key={section.title}>
          <Text style={[styles.sectionTitle, { color: c.secondaryText }]}>
            {section.title}
          </Text>
          <View
            style={[styles.group, { backgroundColor: c.secondaryBackground }]}
          >
            {section.items.map((item, i) => (
              <View
                key={item}
                style={[
                  styles.item,
                  i < section.items.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: c.tertiaryBackground,
                  },
                ]}
              >
                <Text style={[styles.itemText, { color: c.text }]}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  group: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  item: {
    padding: 14,
    paddingHorizontal: 16,
  },
  itemText: {
    fontSize: 16,
  },
});
