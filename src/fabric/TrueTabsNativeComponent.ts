import { codegenNativeComponent } from 'react-native';
import type { ColorValue, ViewProps } from 'react-native';
import type {
  DirectEventHandler,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';

type TabItem = Readonly<{
  title: string;
  sfSymbol?: string;
  iconUri?: string;
  badge?: string;
}>;

export interface NativeProps extends ViewProps {
  items: ReadonlyArray<TabItem>;
  selectedIndex?: Int32;
  onTabSelect?: DirectEventHandler<Readonly<{ index: Int32 }>>;
  onTabPress?: DirectEventHandler<Readonly<{ index: Int32 }>>;
  translucent?: boolean;
  barTintColor?: ColorValue;
  activeTintColor?: ColorValue;
  inactiveTintColor?: ColorValue;
  activeIndicatorColor?: ColorValue;
  activeBackgroundColor?: ColorValue;
}

export default codegenNativeComponent<NativeProps>('TrueTabsView');
