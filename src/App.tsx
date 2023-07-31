import React, { useState, useEffect } from 'react';
import './App.css';
import PinInput from './pin/PinInput';

function App() {
  const [pinCount, setPinCount] = useState(6);
  const [secretMode, setSecretMode] = useState(false);
  const [customPattern, setCustomPattern] = useState('');

  const handlePinFilled = (pin: string) => {
    // Do something with the filled PIN
    alert(`PIN filled: ${pin}`);
  };

  const handlePinCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPinCount = parseInt(event.target.value, 10);
    if (!isNaN(newPinCount) && newPinCount >= 1 && newPinCount <= 10) {
      setPinCount(newPinCount);
    }
  };

  const handleSecretModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSecretMode(event.target.checked);
  };

  const handleCustomPatternChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomPattern(event.target.value);
  };

  return (
    <div className="App">
      <h1>Pin Input Component</h1>
      <div className="input-group">
        <label htmlFor="pinCountInput">Pin Count: </label>
        <input
          id="pinCountInput"
          type="number"
          min="1"
          max="10"
          value={pinCount}
          onChange={handlePinCountChange}
        />
      </div>
      <div className="input-group">
        <label htmlFor="secretModeCheckbox">Secret Mode: </label>
        <input
          id="secretModeCheckbox"
          type="checkbox"
          checked={secretMode}
          onChange={handleSecretModeChange}
        />
      </div>
      <div className="input-group">
        <label htmlFor="customPatternInput">Custom Pattern: </label>
        <input
          id="customPatternInput"
          type="text"
          value={customPattern}
          onChange={handleCustomPatternChange}
        />
      </div>
      <div className="input-group">
        <PinInput
          pinCount={pinCount}
          secretMode={secretMode}
          onFilled={handlePinFilled}
          customPattern={customPattern}
        />
      </div>
    </div>
  );
}

export default App;
