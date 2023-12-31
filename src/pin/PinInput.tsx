import React, { useState, ChangeEvent, useRef, useEffect } from 'react';

interface PinInputProps {
  pinCount: number;
  secretMode?: boolean;
  onFilled?: (pin: string) => void;
  customPattern?: string;
}

const PinInput: React.FC<PinInputProps> = ({ pinCount, secretMode = false, onFilled, customPattern }) => {
  const [pins, setPins] = useState<string[]>(Array(pinCount).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    // Initialize the ref array with the input elements
    inputRefs.current = inputRefs.current.slice(0, pinCount);
    setPins(Array(pinCount).fill(''));

    for (let i = 0; i < pinCount; i++) {
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = '';
      }
    }
    // Focus on the first input when the component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [pinCount]);

  const handlePinChange = (index: number, value: string) => {
    // Check if the input matches the custom pattern
    const pattern = new RegExp(customPattern || '[0-9]');
    const isValidInput = pattern.test(value);

    if (isValidInput) {
      const newPins = [...pins];
      newPins[index] = value.slice(0, 1); // Limit to one character
      setPins(newPins);

      // Move focus to the next empty box, if available
      const nextEmptyBoxIndex = newPins.findIndex((pin) => pin === '');
      if (nextEmptyBoxIndex !== -1 && inputRefs.current[nextEmptyBoxIndex]) {
        inputRefs.current[nextEmptyBoxIndex].focus();
      }

      // Invoke the onFilled callback when all boxes are filled
      if (newPins.every((pin) => pin !== '') && onFilled) {
        onFilled(newPins.join(''));
      }
    } else {
      inputRefs.current[index].value = '';
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData('text');
    const sanitizedData = pastedData.replace(/[^0-9]/g, '').slice(0, pinCount);

    if (sanitizedData.length > 0) {
      const newPins = [...pins];
      for (let i = 0; i < sanitizedData.length; i++) {
        newPins[i] = sanitizedData[i];
        if (inputRefs.current[i]) {
          inputRefs.current[i].value = sanitizedData[i];
        }
      }
      setPins(newPins);

      if (newPins.every((pin) => pin !== '') && onFilled) {
        onFilled(newPins.join(''));
      }
    }
    e.preventDefault();
  };

  return (
    <div>
      {pins.map((pin, index) => (
        <input
          key={index}
          ref={(input) => (inputRefs.current[index] = input!)}
          type={secretMode ? 'password' : 'text'}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handlePinChange(index, e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            // Allow navigating back to the previous box if the current box is empty and the user presses the backspace key
            if (e.key === 'Backspace' && inputRefs.current[index - 1]) {
              const newPins = [...pins];
              newPins[index] = ''; // Limit to one character
              inputRefs.current[index].value = '';
              newPins[index - 1] = ''; // Limit to one character
              inputRefs.current[index - 1].value = '';
              setPins(newPins);

              inputRefs.current[index - 1].focus();
            }
          }}
          onPaste={handlePaste} // Handle pasting
          size={1}
          maxLength={1}
          autoFocus={index === 0} // Set autoFocus on the first input
          style={{ width: '40px', height: '40px', fontSize: '24px', textAlign: 'center', marginRight: '5px' }}
        />
      ))}
    </div>
  );
};

export default PinInput;
