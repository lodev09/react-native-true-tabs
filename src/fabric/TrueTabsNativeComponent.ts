import { codegenNativeComponent } from 'react-native';
import type { ColorValue, ViewProps } from 'react-native';
import type {
  DirectEventHandler,
  Int32,
  ReadonlyArray,
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
  translucent?: boolean;
  tintColor?: ColorValue;
  activeTintColor?: ColorValue;
}

export default codegenNativeComponent<NativeProps>('TrueTabsView');
