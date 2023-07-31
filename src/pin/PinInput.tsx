import React, { useState, ChangeEvent, useRef, useEffect } from 'react';

interface PinInputProps {
  pinCount: number;
}

const PinInput: React.FC<PinInputProps> = ({ pinCount }) => {
  const [pins, setPins] = useState<string[]>(Array(pinCount).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    // Initialize the ref array with the input elements
    inputRefs.current = inputRefs.current.slice(0, pinCount);
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
  };

  return (
    <div>
      {pins.map((pin, index) => (
        <input
          key={index}
          ref={(input) => (inputRefs.current[index] = input!)}
          type="text"
          pattern="[0-9]"
          value={pin}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handlePinChange(index, e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            // Allow navigating back to the previous box if the current box is empty and the user presses the backspace key
            if (e.key === 'Backspace' && pin === '' && inputRefs.current[index - 1]) {
              inputRefs.current[index - 1].focus();
            }
          }}
          size={1}
          maxLength={1}
        />
      ))}
    </div>
  );
};

export default PinInput;
