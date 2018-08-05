import React from 'react';

import './App.css';

export default class List extends React.Component {
  static defaultProps = {
    onRefsChange: () => null
  };

  _ref = {};

  componentDidUpdate() {
    Object.keys(this._ref).forEach(f => {
      if (this._ref[f] === null) {
        delete this._ref[f];
      }
    });

    this.props.onRefsChange(this._ref);
  }

  render = () => {
    return (
      <div
        style={{
          paddingTop: this.props.paddingBefore ? this.props.paddingBefore : 0,
          paddingBottom: this.props.paddingAfter ? this.props.paddingAfter : 0
        }}
      >
        {this.props.data.map(item => (
          <div
            ref={ref => (this._ref[item.id] = ref)}
            key={item.id}
            style={{
              backgroundColor: item.id % 2 === 0 ? 'green' : 'purple',
              width: '100%',
              paddingTop: '50%'
            }}
            className="f"
          >
            <div style={{ height: item.height }}>{`${item.id}`}</div>
          </div>
        ))}
      </div>
    );
  };
}
