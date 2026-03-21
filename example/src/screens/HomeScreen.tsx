import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../theme';

const TAB_BAR_HEIGHT = 90;

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

export function HomeScreen() {
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
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[styles.name, { color: c.text }]}>{item.name}</Text>
              <Text style={[styles.time, { color: c.secondaryText }]}>
                {item.time}
              </Text>
            </View>
            <Text
              style={[styles.message, { color: c.secondaryText }]}
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

const styles = StyleSheet.create({
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
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 13,
  },
  message: {
    fontSize: 15,
  },
});
