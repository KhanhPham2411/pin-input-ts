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
    const newPins = [...pins];
    newPins[index] = value;
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
          value={pin}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handlePinChange(index, e.target.value)}
          size={1}
          maxLength={1}
        />
      ))}
    </div>
  );
};

export default PinInput;
