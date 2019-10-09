import React from 'react';
import logo from './logo.svg';
import { useDispatch, useSelector } from 'dva';
import { Button, Icon, Tabs } from 'antd';
import './App.css';

// import * as electron from 'electron';
// import { EngineIdentifier, search } from 'noob-dict-core';
// console.log(electron);
// console.log(EngineIdentifier, search);

const App: React.FC = () => {
  // const [counter, setCounter] = useState(0);
  const counter = useSelector((state: any) => {
    return state.app.counter;
  });
  const dispatch = useDispatch();


  async function onClick() {
    // const res = await search('go');
    // console.log(res);
    console.log('click');
    dispatch({ type: 'app/inc' });
  }

  return (
    <Tabs tabPosition="left" type="card">
      <Tabs.TabPane
        tab={<Icon type="apple"/>}
        key="1"
      >
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
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={<Icon type="android"/>}
        key="2"
      >
      </Tabs.TabPane>
    </Tabs>
  );
};

// export default connect((state: { app: any }) => ({ counter: state.app.counter }))(App);
export default App;
