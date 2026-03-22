import { createTrueTabs } from '@lodev09/react-native-true-tabs';

export type TabName = 'home' | 'search' | 'settings';

export const Tabs = createTrueTabs<TabName>([
  {
    name: 'home',
    title: 'Home',
    icon: { sfSymbol: 'house.fill' },
    badge: '69',
  },
  { name: 'search', title: 'Search', icon: { sfSymbol: 'magnifyingglass' } },
  {
    name: 'settings',
    title: 'Settings',
    icon: { sfSymbol: 'gearshape.fill' },
  },
]);
