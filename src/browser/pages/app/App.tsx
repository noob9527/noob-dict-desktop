import React from 'react';
import './App.css';
import { useDispatch, useSelector } from "react-redux";
import * as Electron from 'electron';
import { Button } from "antd";


const App: React.FC = () => {
  const counter = useSelector((state: any) => {
    return state.app.counter;
  });
  const dispatch = useDispatch();

  return (
    <div className="App">
      <header className="App-header">
        <p>AppPath: {Electron.remote.app.getAppPath()}</p>
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

        <Button type="primary" onClick={() => {
          dispatch({ type: 'app/inc' });
        }}>inc</Button>
        <Button onClick={() => {
          dispatch({ type: 'app/increase' });
        }}>increase</Button>

        <Button type="primary" onClick={() => {
          dispatch({ type: 'app/dec' });
        }}>dec</Button>
        <Button onClick={() => {
          dispatch({ type: 'app/decrease' });
        }}>decrease</Button>

        <div>counter: {counter}</div>
      </header>
    </div>
  );
};

export default App;
