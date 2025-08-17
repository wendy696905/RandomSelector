import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ResultModal } from '../components/ResultModal';

describe('ResultModal', () => {
  const mockProps = {
    visible: true,
    winner: { id: '1', name: 'Alice' },
    onClose: jest.fn(),
    onPlayAgain: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders when visible with winner', () => {
    const { getByText } = render(<ResultModal {...mockProps} />);
    
    expect(getByText('Winner!')).toBeTruthy();
    expect(getByText('Alice')).toBeTruthy();
    expect(getByText('🎯 Spin Again')).toBeTruthy();
    expect(getByText('✏️ Edit Players')).toBeTruthy();
  });

  test('does not render when not visible', () => {
    const { queryByText } = render(
      <ResultModal {...mockProps} visible={false} />
    );
    
    expect(queryByText('Winner!')).toBeNull();
  });

  test('calls onPlayAgain when spin again pressed', () => {
    const { getByText } = render(<ResultModal {...mockProps} />);
    
    fireEvent.press(getByText('🎯 Spin Again'));
    expect(mockProps.onPlayAgain).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when edit players pressed', () => {
    const { getByText } = render(<ResultModal {...mockProps} />);
    
    fireEvent.press(getByText('✏️ Edit Players'));
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('handles missing winner gracefully', () => {
    const { queryByText } = render(
      <ResultModal {...mockProps} winner={null} />
    );
    
    // Should still render modal structure but handle null winner
    expect(queryByText('Winner!')).toBeTruthy();
  });
});
