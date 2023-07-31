import React from 'react';
import logo from './logo.svg';
import './App.css';
import ReactCodeInput from './pin/ReactCodeInput';
import PinInput from './pin/PinInput';

function App() {
  const handlePinFilled = (pin: string) => {
    // Do something with the filled PIN
    alert(`PIN filled: ${pin}`);
  };

  return (
    <div className="App">
      <h1>Pin Input Component</h1>
      <PinInput pinCount={3} secretMode={false} onFilled={handlePinFilled} />
    </div>
  );
}

export default App;
