jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const SafeAreaView = React.forwardRef((props, ref) =>
    React.createElement(View, { ...props, ref }),
  );
  SafeAreaView.displayName = 'SafeAreaView';

  return {
    SafeAreaView,
    SafeAreaProvider: ({ children }) => children,
    SafeAreaInsetsContext: React.createContext(null),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});
