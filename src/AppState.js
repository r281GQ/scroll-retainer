import React, { Component, createContext } from 'react';

const { Provider, Consumer } = createContext();

export { Consumer as AppStateContext };

function getData(num, from = 0) {
  return new Array(num).fill(1).map((_, index) => ({
    id: from + index,
    height: Math.random() * 200 + 50
  }));
}

export default class AppStateProvider extends Component {
  state = {
    data: getData(50),
    persistedHeight: 0,
    persistedItemHeights: {}
  };

  persistScrollPosition = ({ persistedHeight, persistedItemHeights }) =>
    this.setState({ persistedHeight, persistedItemHeights });

  render = () => {
    return (
      <Provider
        value={{
          ...this.state,

          persistScrollPosition: this.persistScrollPosition
        }}
      >
        {this.props.children}
      </Provider>
    );
  };
}
