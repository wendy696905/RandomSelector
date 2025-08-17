import '@testing-library/jest-native/extend-expect';

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Mock react-native-svg - Fixed version
jest.mock('react-native-svg', () => {
  const React = require('react');
  return {
    Svg: React.forwardRef((props, ref) => React.createElement('View', { ...props, ref })),
    Path: React.forwardRef((props, ref) => React.createElement('View', { ...props, ref })),
    Text: React.forwardRef((props, ref) => React.createElement('Text', { ...props, ref })),
    Circle: React.forwardRef((props, ref) => React.createElement('View', { ...props, ref })),
    G: React.forwardRef((props, ref) => React.createElement('View', { ...props, ref })),
    Defs: React.forwardRef((props, ref) => React.createElement('View', { ...props, ref })),
    LinearGradient: React.forwardRef((props, ref) => React.createElement('View', { ...props, ref })),
    Stop: React.forwardRef((props, ref) => React.createElement('View', { ...props, ref })),
  };
});

jest.mock("expo/src/winter/ImportMetaRegistry", () => ({
  ImportMetaRegistry: {
    get url() {
      return null;
    },
  },
}));