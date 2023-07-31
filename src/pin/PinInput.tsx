import React, { useState, ChangeEvent, useRef, useEffect } from 'react';

interface PinInputProps {
  pinCount: number;
  secretMode?: boolean;
  onFilled?: (pin: string) => void;
}

const PinInput: React.FC<PinInputProps> = ({ pinCount, secretMode = false, onFilled }) => {
  const [pins, setPins] = useState<string[]>(Array(pinCount).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    // Initialize the ref array with the input elements
    inputRefs.current = inputRefs.current.slice(0, pinCount);

    // Focus on the first input when the component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [pinCount]);

  const handlePinChange = (index: number, value: string) => {
    // Only allow digits 0-9 in the input
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    const newPins = [...pins];
    newPins[index] = sanitizedValue.slice(0, 1); // Limit to one digit
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
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text/plain');
    const sanitizedData = pastedData.replace(/[^0-9]/g, '');

    if (sanitizedData.length <= pinCount) {
      // If the pasted data fits in the pinCount, update the state with the pasted data
      const newPins = [...pins];
      sanitizedData.split('').forEach((digit, index) => {
        newPins[index] = digit;
      });
      setPins(newPins);
    }
  };

  const getMaskedValue = (value: string) => (secretMode ? '*' : value);

  return (
    <div>
      {pins.map((pin, index) => (
        <input
          key={index}
          ref={(input) => (inputRefs.current[index] = input!)}
          type={secretMode ? 'password' : 'text'}
          pattern="[0-9]"
          value={getMaskedValue(pin)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handlePinChange(index, e.target.value)}
          onPaste={handlePaste}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            // Allow navigating back to the previous box if the current box is empty and the user presses the backspace key
            if (e.key === 'Backspace' && pin === '' && inputRefs.current[index - 1]) {
              inputRefs.current[index - 1].focus();
            }
          }}
          size={1}
          maxLength={1}
          autoFocus={index === 0} // Set autoFocus on the first input
        />
      ))}
    </div>
  );
};

export default PinInput;
