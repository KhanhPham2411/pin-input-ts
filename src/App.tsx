import React, { useState, useEffect } from 'react';
import './App.css';
import PinInput from './pin/PinInput';

function App() {
  const [pinCount, setPinCount] = useState(6);
  const [secretMode, setSecretMode] = useState(false);
  const [customPattern, setCustomPattern] = useState('[0-9]');

  const handlePinFilled = (pin: string) => {
    // Do something with the filled PIN
    alert(`PIN filled: ${pin}`);
  };

  const handlePinCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPinCount = parseInt(event.target.value);
    if (!isNaN(newPinCount) && newPinCount >= 1) {
      setPinCount(newPinCount);
    }
  };

  const handleSecretModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSecretMode(event.target.checked);
  };

  const handleCustomPatternChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomPattern(event.target.value);
  };

  const handleResetPin = () => {
    // Set the pins state to an array of empty strings (default values)
    setPinCount(6);
    setSecretMode(false);
    setCustomPattern('[0-9]');
  };

  return (
    <div className="App">
      <h1>Pin Input Component</h1>
      <div className="input-group">
        <label htmlFor="pinCountInput" className="fancy-label">Pin Count:</label>
        <input
          id="pinCountInput"
          type="number"
          min="1"
          value={pinCount}
          onChange={handlePinCountChange}
          className="fancy-input"
        />
      </div>
      <div className="input-group">
        <label htmlFor="secretModeCheckbox" className="fancy-label">Secret Mode:</label>
        <input
          id="secretModeCheckbox"
          type="checkbox"
          checked={secretMode}
          onChange={handleSecretModeChange}
          className="fancy-input"
        />
      </div>
      <div className="input-group">
        <label htmlFor="customPatternInput" className="fancy-label">Custom Pattern:</label>
        <input
          id="customPatternInput"
          type="text"
          value={customPattern}
          onChange={handleCustomPatternChange}
          className="fancy-input"
        />
      </div>
      <div className="input-group">
        <button className="fancy-button" onClick={handleResetPin}>Set Default</button>
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
