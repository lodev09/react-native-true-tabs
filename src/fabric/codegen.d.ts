declare module 'react-native/Libraries/Types/CodegenTypes' {
  export type DirectEventHandler<T> = (event: { nativeEvent: T }) => void;
  export type Int32 = number;
  export type ReadonlyArray<T> = readonly T[];
}
