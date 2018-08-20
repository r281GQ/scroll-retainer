import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

import Feed from './Feed';
import AppStateProvider from './AppState';

export default class App extends React.Component {
  render = () => {
    return (
      <BrowserRouter>
        <AppStateProvider>
          <Route
            render={() => {
              return (
                <div>
                  <Link to="/"> Feed </Link> <Link to="/other"> Other</Link>
                </div>
              );
            }}
          />
          <Switch>
            <Route component={Feed} path="/" exact />
            <Route
              render={() => {
                return <div>Other component</div>;
              }}
              path="/other"
              exact
            />
          </Switch>
        </AppStateProvider>
      </BrowserRouter>
    );
  };
}
