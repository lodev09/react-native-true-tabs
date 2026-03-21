import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme';

const TAB_BAR_HEIGHT = 90;

const CATEGORIES = [
  { id: '1', title: 'Photos', count: 128 },
  { id: '2', title: 'Links', count: 47 },
  { id: '3', title: 'Documents', count: 23 },
  { id: '4', title: 'Audio', count: 12 },
];

const RECENT_SEARCHES = [
  'react-native-true-tabs',
  'deployment guide',
  'API docs',
];

export function SearchScreen() {
  const c = useTheme();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
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
        {CATEGORIES.map((cat) => (
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
      {RECENT_SEARCHES.map((term) => (
        <View
          key={term}
          style={[
            styles.recentItem,
            { borderBottomColor: c.tertiaryBackground },
          ]}
        >
          <Text style={[styles.recentText, { color: c.text }]}>{term}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
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
});
