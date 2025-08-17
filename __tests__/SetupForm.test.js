import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { SetupForm } from '../components/SetupForm';

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('SetupForm', () => {
  const mockProps = {
    onStartSpinner: jest.fn(),
    onBack: jest.fn(),
    existingGameData: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<SetupForm {...mockProps} />);
    
    expect(getByText('Setup Game')).toBeTruthy();
    expect(getByPlaceholderText('Enter one name at a time')).toBeTruthy();
    expect(getByText('Need 2+ Participants')).toBeTruthy();
  });

  test('adds participant successfully', async () => {
    const { getByPlaceholderText, getByText } = render(<SetupForm {...mockProps} />);
    
    const input = getByPlaceholderText('Enter one name at a time');
    const addButton = getByText('Add');
    
    fireEvent.changeText(input, 'Alice');
    fireEvent.press(addButton);
    
    await waitFor(() => {
      expect(getByText('Alice')).toBeTruthy();
      expect(getByText('Participants (1)')).toBeTruthy();
    });
  });

  test('button is disabled with less than 2 participants', () => {
    const { getByText } = render(<SetupForm {...mockProps} />);
    
    const startButton = getByText('Need 2+ Participants');
    
    // Check that the button shows the correct disabled text
    expect(startButton).toBeTruthy();
    
    // Try to press the disabled button - should not call onStartSpinner
    fireEvent.press(startButton);
    expect(mockProps.onStartSpinner).not.toHaveBeenCalled();
    
    // Should not show alert since button is disabled
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  test('button becomes enabled and changes text with 2+ participants', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<SetupForm {...mockProps} />);
    
    const input = getByPlaceholderText('Enter one name at a time');
    const addButton = getByText('Add');
    
    // Add first participant
    fireEvent.changeText(input, 'Alice');
    fireEvent.press(addButton);
    
    await waitFor(() => {
      expect(getByText('Alice')).toBeTruthy();
    });
    
    // Add second participant
    fireEvent.changeText(input, 'Bob');
    fireEvent.press(addButton);
    
    await waitFor(() => {
      expect(getByText('Bob')).toBeTruthy();
      // Button text should change to enabled state
      expect(getByText('Start Spinning! 🎯')).toBeTruthy();
      // Disabled text should no longer exist
      expect(queryByText('Need 2+ Participants')).toBeNull();
    });
    
    // Now the button should be functional
    const enabledButton = getByText('Start Spinning! 🎯');
    fireEvent.press(enabledButton);
    
    expect(mockProps.onStartSpinner).toHaveBeenCalledWith({
      participants: [
        expect.objectContaining({ name: 'Alice' }),
        expect.objectContaining({ name: 'Bob' })
      ],
      title: 'Who Pays?'
    });
  });

  test('validates against multiple names in input', () => {
    const { getByPlaceholderText, getByText } = render(<SetupForm {...mockProps} />);
    
    const input = getByPlaceholderText('Enter one name at a time');
    const addButton = getByText('Add');
    
    fireEvent.changeText(input, 'Alice, Bob, Charlie');
    fireEvent.press(addButton);
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'One Name at a Time',
      'Please enter only one participant name at a time. Use the Add button for each person.',
      [{ text: 'OK' }]
    );
  });
});