import React from 'react';
import './App.css';
import { AppActions2, useAppStore } from './app-store';
import decCount = AppActions2.decCount;
import nest1AppendBar = AppActions2.nest1AppendBar;

const App: React.FC = () => {
  const {
    count,
    incCount,
    nest1,
    nest1AppendFoo,
  } = useAppStore()
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>{count}</div>
        <button onClick={incCount}>increase</button>
        <button onClick={decCount}>decrease</button>
        <div>{nest1.text}</div>
        <button onClick={nest1AppendFoo}>nest1 append foo</button>
        <button onClick={nest1AppendBar}>nest1 append bar</button>
      </header>
    </div>
  );
};

export default App;
