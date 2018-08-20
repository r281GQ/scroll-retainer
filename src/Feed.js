import React, { Component, Fragment } from 'react';
import './App.css';

import ViewPort from './ViewPort';

import { AppStateContext } from './AppState';

import ViewScroll from './ViewScroll';

export default class Feed extends Component {
  state = {
    viewPortRef: undefined
  };

  _viewPort = undefined;

  _getViewPort = () => {
    const { viewPortRef } = this.state;

    if (this._viewPort) {
      return this._viewPort;
    } else {
      this._viewPort = new ViewPort(viewPortRef);
      return this._viewPort;
    }
  };

  render() {
    return (
      <AppStateContext>
        {renderProps => {
          const {
            persistScrollPosition,
            persistedItemHeights,
            persistedHeight,
            data
          } = renderProps;

          return (
            <Fragment>
              <div
                style={{ overflow: 'scroll', height: '50vh' }}
                ref={viewPortRef => {
                  this.setState(state => {
                    if (!state.viewPortRef) return { viewPortRef };
                  });
                }}
                className="l"
              >
                {this.state.viewPortRef ? (
                  <ViewScroll
                    viewPort={this._getViewPort()}
                    data={data}
                    averageHeight={300}
                    defaultScroll={persistedHeight}
                    defaultHeights={persistedItemHeights}
                    onDestroy={props => persistScrollPosition(props)}
                  />
                ) : null}
              </div>
              <button
                onClick={() => {
                  this._getViewPort()._scrollTo(15000);
                }}
              >
                scroll
              </button>

              <button onClick={() => {}}>change list</button>
            </Fragment>
          );
        }}
      </AppStateContext>
    );
  }
}
