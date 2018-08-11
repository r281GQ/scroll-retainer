import React, { Component, Fragment } from 'react';
import './App.css';

import ViewPort from './ViewPort';

import ViewScroll from './ViewScroll';

function getData(num, from = 0) {
  return new Array(num).fill(1).map((_, index) => ({
    id: from + index,
    height: Math.random() * 200 + 50
  }));
}

let f = getData(50);

class App extends Component {
  state = {
    viewPortRef: undefined,
    data: f
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
              data={this.state.data}
              averageHeight={300}
              defaultIndex={30}
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

        <button
          onClick={() => {
            this.setState({ data: getData(100) });
          }}
        >
          change list
        </button>
      </Fragment>
    );
  }
}

export default App;
