import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

// const electron = window.require('electron');
// const ipc = electron.ipcRenderer as Electron.IpcRenderer;

const { EngineIdentifier, search } = window.require('noob-dict-core');

const App: React.FC = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setCounter(counter + 1), 1000);
    return () => {
      clearTimeout(timer);
    };
  });

  async function onClick() {
    const res = await search('go', EngineIdentifier.BING);
    console.log(res);
    console.log('click');
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
