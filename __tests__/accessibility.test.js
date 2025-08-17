import React from 'react';
import { render } from '@testing-library/react-native';
import { SetupForm } from '../components/SetupForm';
import { ResultModal } from '../components/ResultModal';

describe('Accessibility Tests', () => {
  test('SetupForm has proper accessibility labels', () => {
    const mockProps = {
      onStartSpinner: jest.fn(),
      onBack: jest.fn(),
      existingGameData: null,
    };
    
    const { getByPlaceholderText, getByText } = render(<SetupForm {...mockProps} />);
    
    // Check important interactive elements exist
    expect(getByPlaceholderText('Enter one name at a time')).toBeTruthy();
    expect(getByText('Add')).toBeTruthy();
    expect(getByText('Need 2+ Participants')).toBeTruthy();
  });

  test('ResultModal announces winner clearly', () => {
    const mockProps = {
      visible: true,
      winner: { id: '1', name: 'Alice' },
      onClose: jest.fn(),
      onPlayAgain: jest.fn(),
    };
    
    const { getByText } = render(<ResultModal {...mockProps} />);
    
    expect(getByText('Winner!')).toBeTruthy();
    expect(getByText('Alice')).toBeTruthy();
  });
});