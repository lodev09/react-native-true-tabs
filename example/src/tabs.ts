import { createTrueTabs } from '@lodev09/react-native-true-tabs';

export type TabName = 'home' | 'search' | 'settings';

export const Tabs = createTrueTabs<TabName>([
  {
    name: 'home',
    title: 'Home',
    icon: { sfSymbol: 'house.fill', source: require('./assets/home.png') },
    badge: '69',
  },
  {
    name: 'search',
    title: 'Search',
    icon: {
      sfSymbol: 'magnifyingglass',
      source: require('./assets/search.png'),
    },
  },
  {
    name: 'settings',
    title: 'Settings',
    icon: {
      sfSymbol: 'gearshape.fill',
      source: require('./assets/settings.png'),
    },
  },
]);
