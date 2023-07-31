// PinInput.test.tsx

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For custom DOM matchers
import PinInput from './PinInput';

test('typing a valid PIN and invoking onFilled callback', () => {
  // Mock the onFilled callback function
  const onFilledMock = jest.fn();

  // Render the PinInput component with a pinCount of 4 and onFilledMock as the onFilled callback
  render(<PinInput pinCount={4} onFilled={onFilledMock} />);

  // Find all input elements
  const inputElements = screen.getAllByRole('textbox');

  // Type a valid PIN "1234"
  fireEvent.change(inputElements[0], { target: { value: '1' } });
  fireEvent.change(inputElements[1], { target: { value: '2' } });
  fireEvent.change(inputElements[2], { target: { value: '3' } });
  fireEvent.change(inputElements[3], { target: { value: '4' } });

  // Check if the onFilledMock callback has been called with the correct PIN
  expect(onFilledMock).toHaveBeenCalledWith('1234');
});

test('typing an invalid character and not invoking onFilled callback', () => {
  // Mock the onFilled callback function
  const onFilledMock = jest.fn();

  // Render the PinInput component with a pinCount of 4 and onFilledMock as the onFilled callback
  render(<PinInput pinCount={4} onFilled={onFilledMock} />);

  // Find all input elements
  const inputElements = screen.getAllByRole('textbox');

  // Type an invalid character in the first input box (should not invoke onFilled callback)
  fireEvent.change(inputElements[0], { target: { value: 'A' } });

  // Check if the onFilledMock callback has not been called
  expect(onFilledMock).not.toHaveBeenCalled();
});
