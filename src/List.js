import React, { Component } from 'react';
import { func, number } from 'prop-types';

import './App.css';

export default class List extends Component {
  static propTypes = {
    onRefsChange: func,
    paddingAfter: number,
    paddingBefore: number
  };

  static defaultProps = {
    onRefsChange: () => null,
    paddingAfter: 0,
    paddingBefore: 0
  };

  state = { initialised: false };

  _ref = {};

  _handleItemRefChange = id => ref => {
    this._ref[id] = ref;
  };

  _handleRefChange = () => {
    Object.keys(this._ref).forEach(id => {
      if (this._ref[id] === null) {
        delete this._ref[id];
      }
    });
  };

  componentDidUpdate = prevProps => {
    if (
      this.props.paddingAfter !== 0 &&
      prevProps.paddingAfter === 0 &&
      !this.state.initialised
    ) {
      this.props.onFirstPaddingApplied();
      this.setState({ initialised: true });
    }

    this._handleRefChange();

    this.props.onRefsChange(this._ref);
  };

  render = () => {
    const { data, paddingAfter, paddingBefore } = this.props;

    return (
      <div
        style={{
          paddingTop: paddingBefore,
          paddingBottom: paddingAfter
        }}
      >
        {data.map(item => {
          const { id, height } = item;

          return (
            <div
              ref={this._handleItemRefChange(id)}
              key={id}
              style={{
                backgroundColor: id % 2 === 0 ? 'green' : 'purple',
                width: '100%',
                paddingTop: '50%'
              }}
              className="f"
            >
              <div style={{ height }}>{`${id}`}</div>
            </div>
          );
        })}
      </div>
    );
  };
}
