import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

// const electron = window.require('electron');
// const ipc = electron.ipcRenderer as Electron.IpcRenderer;

const App: React.FC = () => {
  const [counter, setCounter] = useState(0);
  const [trayOn, setTrayOn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCounter(counter + 1), 1000);
    return () => {
      clearTimeout(timer);
    };
  });

  function onClick() {
    if (trayOn) {
      console.log(trayOn);
    } else {
      console.log(trayOn);
    }
    setTrayOn(!trayOn);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={onClick}>button</button>
        <div>counter: {counter}</div>
      </header>
    </div>
  );
};

export default App;
