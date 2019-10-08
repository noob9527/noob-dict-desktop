import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import { Button } from 'antd';
import './App.css';

import * as electron from 'electron';
import { EngineIdentifier, search } from 'noob-dict-core';

console.log(electron);
console.log(EngineIdentifier, search);

const App: React.FC = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setCounter(counter + 1), 1000);
    return () => {
      clearTimeout(timer);
    };
  });

  async function onClick() {
    const res = await search('go');
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
        <Button type="primary" onClick={onClick}>Button</Button>
        <div>counter: {counter}</div>
      </header>
    </div>
  );
};

export default App;
