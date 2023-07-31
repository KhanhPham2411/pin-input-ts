import React from 'react';
import logo from './logo.svg';
import './App.css';
import ReactCodeInput from './pin/ReactCodeInput';
import PinInput from './pin/PinInput';

function App() {
  return (
    <div className="App">
      <h1>Pin Input Component</h1>
      <PinInput pinCount={3} secretMode={false} />
    </div>
  );
}

export default App;
