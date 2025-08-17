import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Header } from '../components/Header';

describe('Header', () => {
  test('renders title correctly', () => {
    const { getByText } = render(<Header title="Test Title" />);
    expect(getByText('Test Title')).toBeTruthy();
  });

  test('renders back button when onBack provided', () => {
    const mockOnBack = jest.fn();
    const { getByText } = render(
      <Header title="Test" onBack={mockOnBack} />
    );
    
    expect(getByText('← Back')).toBeTruthy();
    
    fireEvent.press(getByText('← Back'));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test('renders reset button when onReset provided', () => {
    const mockOnReset = jest.fn();
    const { getByText } = render(
      <Header title="Test" onReset={mockOnReset} />
    );
    
    expect(getByText('New Game')).toBeTruthy();
    
    fireEvent.press(getByText('New Game'));
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  test('does not render buttons when callbacks not provided', () => {
    const { queryByText } = render(<Header title="Test" />);
    
    expect(queryByText('← Back')).toBeNull();
    expect(queryByText('New Game')).toBeNull();
  });

  test('renders both buttons when both callbacks provided', () => {
    const { getByText } = render(
      <Header title="Test" onBack={jest.fn()} onReset={jest.fn()} />
    );
    
    expect(getByText('← Back')).toBeTruthy();
    expect(getByText('New Game')).toBeTruthy();
  });
});