import React from 'react';
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import SearchPage from '../search/search-page';
import App from '../app/App';
import styled from 'styled-components';
import { MainMenu, MainMenuItem } from './main-menu';
import { Icon } from 'antd';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { TablePage } from '../table/table';
import { TranslatePage } from '../textarea/translate/translate-page';
import { WriteSuggestionPage } from '../textarea/write-suggestion/write-suggestion-page';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const SideBar = styled.div`
  height: 100vh;
`;

const Content = styled.div`
  flex: 1;
`;

const StyledIcon = styled(Icon)`
  font-size: 2em;
`;

const MainPage: React.FC = () => {
  // @ts-ignore
  const { path, url } = useRouteMatch();
  const location = useLocation();
  const dispatch = useDispatch();

  function goto(routeName: string) {
    dispatch(push(`${url}/${routeName}`));
  }

  return (
    <>
      <Container>
        <SideBar>
          <MainMenu>
            <MainMenuItem
              key={'search'}
              active={location.pathname.includes('search')}
              onClick={() => goto('search')}
            >
              {/*<Link to={`${url}/search`}>search</Link>*/}
              <StyledIcon type={'search'}/>
            </MainMenuItem>
            <MainMenuItem
              key={'table'}
              active={location.pathname.includes('table')}
              onClick={() => goto('table')}
            >
              {/*<Link to={`${url}/table`}>table</Link>*/}
              <StyledIcon type={'table'}/>
            </MainMenuItem>
            {/*<MainMenuItem*/}
            {/*  key={'chart'}*/}
            {/*  active={location.pathname.includes('chart')}*/}
            {/*  onClick={() => goto('chart')}*/}
            {/*>*/}
            {/*  /!*<Link to={`${url}/chart`}>chart</Link>*!/*/}
            {/*  <StyledIcon type={'pie-chart'}/>*/}
            {/*</MainMenuItem>*/}
            <MainMenuItem
              key={'translate'}
              active={location.pathname.includes('translate')}
              onClick={() => goto('translate')}
            >
              <StyledIcon type={'swap'}/>
            </MainMenuItem>
            <MainMenuItem
              key={'write_suggestion'}
              active={location.pathname.includes('write_suggestion')}
              onClick={() => goto('write_suggestion')}
            >
              <StyledIcon type={'form'}/>
            </MainMenuItem>
          </MainMenu>
        </SideBar>
        <Content>
          <Switch>
            <Route path={`${path}/search`} component={SearchPage}/>
            <Route path={`${path}/table`} component={TablePage}/>
            <Route path={`${path}/chart`} component={App}/>
            <Route path={`${path}/translate`} component={TranslatePage}/>
            <Route path={`${path}/write_suggestion`} component={WriteSuggestionPage}/>
            <Route component={SearchPage}/>
          </Switch>
        </Content>
      </Container>
    </>
  );
};

export { MainPage };
