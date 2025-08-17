import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SetupForm } from '../components/SetupForm';
import { RandomGenerator } from '../utils/RandomGenerator';

describe('Edge Cases and Error Handling', () => {
  describe('SetupForm Edge Cases', () => {
    const mockProps = {
      onStartSpinner: jest.fn(),
      onBack: jest.fn(),
      existingGameData: null,
    };

    test('handles extremely long participant names', () => {
      const { getByPlaceholderText, getByText } = render(<SetupForm {...mockProps} />);
      
      const longName = 'A'.repeat(100);
      const input = getByPlaceholderText('Enter one name at a time');
      
      fireEvent.changeText(input, longName);
      fireEvent.press(getByText('Add'));
      
      // Should still add the participant even with long name
      expect(getByText(longName)).toBeTruthy();
    });

    test('handles special characters in names', () => {
      const { getByPlaceholderText, getByText } = render(<SetupForm {...mockProps} />);
      
      const specialName = 'Alice & Bob ✨';
      const input = getByPlaceholderText('Enter one name at a time');
      
      fireEvent.changeText(input, specialName);
      fireEvent.press(getByText('Add'));
      
      expect(getByText(specialName)).toBeTruthy();
    });

    test('handles empty title gracefully', () => {
      const { getByDisplayValue } = render(<SetupForm {...mockProps} />);
      
      const titleInput = getByDisplayValue('Who Pays?');
      fireEvent.changeText(titleInput, '');
      
      // Should still allow empty title without crashing
      expect(titleInput).toBeTruthy();
    });
  });

  describe('RandomGenerator Edge Cases', () => {
    test('handles large arrays efficiently', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);
      
      const result = RandomGenerator.selectRandom(largeArray);
      
      expect(result).toHaveProperty('item');
      expect(result).toHaveProperty('index');
      expect(largeArray).toContain(result.item);
    });

    test('generates many colors without error', () => {
      const colors = RandomGenerator.generateColors(100);
      
      expect(colors).toHaveLength(100);
      expect(colors.every(color => typeof color === 'string')).toBe(true);
    });
  });
});