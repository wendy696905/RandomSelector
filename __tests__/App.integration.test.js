import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';

// Mock the complex components to focus on App logic
jest.mock('../components/SpinnerScreen', () => ({
  SpinnerScreen: ({ onSpinComplete, onBack, onReset }) => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    
    return React.createElement(View, { testID: 'spinner-screen' }, [
      React.createElement(Text, { key: 'title' }, 'Spinner Screen'),
      React.createElement(
        TouchableOpacity,
        { key: 'spin', onPress: () => onSpinComplete({ id: '1', name: 'Alice' }) },
        React.createElement(Text, null, 'SPIN')
      ),
      React.createElement(
        TouchableOpacity,
        { key: 'back', onPress: onBack },
        React.createElement(Text, null, 'Back to Setup')
      ),
      React.createElement(
        TouchableOpacity,
        { key: 'reset', onPress: onReset },
        React.createElement(Text, null, 'New Game')
      )
    ]);
  }
}));

describe('App Integration Tests', () => {
  test('complete user flow: home → setup → spinner → result', async () => {
    const { getByText, getByPlaceholderText } = render(<App />);
    
    // 1. Start from home screen
    expect(getByText('Random Selector')).toBeTruthy();
    expect(getByText('Get Started')).toBeTruthy();
    
    // 2. Navigate to setup
    fireEvent.press(getByText('Get Started'));
    expect(getByText('Setup Game')).toBeTruthy();
    
    // 3. Add participants
    const input = getByPlaceholderText('Enter one name at a time');
    const addButton = getByText('Add');
    
    fireEvent.changeText(input, 'Alice');
    fireEvent.press(addButton);
    
    fireEvent.changeText(input, 'Bob');
    fireEvent.press(addButton);
    
    await waitFor(() => {
      expect(getByText('Start Spinning! 🎯')).toBeTruthy();
    });
    
    // 4. Start spinner
    fireEvent.press(getByText('Start Spinning! 🎯'));
    expect(getByText('Spinner Screen')).toBeTruthy();
    
    // 5. Complete spin
    fireEvent.press(getByText('SPIN'));
    
    await waitFor(() => {
      expect(getByText('Winner!')).toBeTruthy();
    });
  });

  test('navigation back button works correctly', () => {
    const { getByText } = render(<App />);
    
    // Go to setup
    fireEvent.press(getByText('Get Started'));
    expect(getByText('Setup Game')).toBeTruthy();
    
    // Go back to home
    fireEvent.press(getByText('← Back'));
    expect(getByText('Random Selector')).toBeTruthy();
  });

  test('reset functionality clears all state', async () => {
    const { getByText, getByPlaceholderText } = render(<App />);
    
    // Set up a game
    fireEvent.press(getByText('Get Started'));
    const input = getByPlaceholderText('Enter one name at a time');
    
    fireEvent.changeText(input, 'Alice');
    fireEvent.press(getByText('Add'));
    fireEvent.changeText(input, 'Bob');
    fireEvent.press(getByText('Add'));
    
    await waitFor(() => {
      fireEvent.press(getByText('Start Spinning! 🎯'));
    });
    
    // Reset from spinner screen
    fireEvent.press(getByText('New Game'));
    
    // Should be back at home
    expect(getByText('Random Selector')).toBeTruthy();
    expect(getByText('Get Started')).toBeTruthy();
  });

  test('spin again functionality preserves game data', async () => {
    const { getByText, getByPlaceholderText } = render(<App />);
    
    // Set up game and get to result
    fireEvent.press(getByText('Get Started'));
    const input = getByPlaceholderText('Enter one name at a time');
    
    fireEvent.changeText(input, 'Alice');
    fireEvent.press(getByText('Add'));
    fireEvent.changeText(input, 'Bob');
    fireEvent.press(getByText('Add'));
    
    await waitFor(() => {
      fireEvent.press(getByText('Start Spinning! 🎯'));
    });
    
    fireEvent.press(getByText('SPIN'));
    
    await waitFor(() => {
      expect(getByText('🎯 Spin Again')).toBeTruthy();
    });
    
    // Spin again should close modal and stay on spinner
    fireEvent.press(getByText('🎯 Spin Again'));
    expect(getByText('Spinner Screen')).toBeTruthy();
  });
});