import React, { Component } from 'react';

import Rectangle from './Rectangle';
import List from './List';

export default class ViewScroll extends Component {
  static defaultProps = {
    bufferCount: 4
  };

  state = { endingIndex: 10, startIndex: 0, initialised: false };

  _recs = {};

  _heights = {};

  _itemRefs = {};

  _sliceList = ({ startIndex, endingIndex }) => ({ id }) =>
    id <= endingIndex && id >= startIndex;

  _handleScroll = scrollTop => {
    const { _calculateRectangles, _heights, _recs } = this;

    const { bufferCount, data, viewPort } = this.props;

    this._recs = _calculateRectangles(data, _heights);

    let startIndex = 0;

    while (true) {
      if (!_recs[startIndex]) {
        break;
      }

      const aggregatedTop = _recs[startIndex]._top;

      if (scrollTop < aggregatedTop) break;

      startIndex++;
    }

    let endingIndex = startIndex;

    while (true) {
      if (!_recs[endingIndex]) {
        break;
      }

      let aggregatedBottom =
        _recs[endingIndex]._top + _recs[endingIndex]._height;

      if (scrollTop + viewPort._getScrollerHeight() < aggregatedBottom) break;

      endingIndex++;
    }

    this.setState({
      startIndex: startIndex - bufferCount <= 0 ? 0 : startIndex - bufferCount,
      endingIndex:
        endingIndex + bufferCount >= this.props.data.length - 1
          ? this.props.data.length - 1
          : endingIndex + bufferCount
    });
  };

  _calculateRectangles = (list, heights = {}, def = 300) => {
    // check if it has been rendered at least one
    // this._refContainer
    // or use defaultheight
    let top = 0;

    const s = list.reduce((sum, item) => {
      const height = heights[item.id] ? heights[item.id] : def;

      const rec = new Rectangle({ height, top });
      sum[item.id] = rec;
      top = top + height;
      return sum;
    }, {});

    return s;
  };

  _handleRefsChange = refs => {
    this._itemRefs = refs;

    const newHeights = {};

    Object.keys(this._itemRefs).forEach(id => {
      newHeights[id] = this._itemRefs[id].getBoundingClientRect().height;
    });

    this._heights = Object.assign({}, this._heights, newHeights);
  };

  _calculatePadding = ({
    initialised,
    startIndex,
    endingIndex,
    lastIndex,
    _recs
  }) => {
    if (!initialised) {
      return {
        before: 0,
        after: 0
      };
    }

    return {
      before: _recs[startIndex]._top,
      after: _recs[lastIndex]._top - _recs[endingIndex]._top
    };
  };

  componentDidMount = () => {
    this._scroller = this.props.viewPort._addScrollListener(event =>
      this._handleScroll(event.target.scrollTop)
    );

    this._recs = this._calculateRectangles(this.props.data, this._heights);

    this.setState({ initialised: true });
  };

  render = () => {
    const { _sliceList, _handleRefsChange, _recs, _calculatePadding } = this;

    const { startIndex, endingIndex, initialised } = this.state;
    const { data } = this.props;

    const lastIndex = data.length - 1;

    const { before, after } = _calculatePadding({
      initialised,
      startIndex,
      endingIndex,
      lastIndex,
      _recs
    });

    return (
      <List
        data={data.filter(_sliceList({ startIndex, endingIndex }))}
        paddingBefore={before}
        paddingAfter={after}
        onRefsChange={_handleRefsChange}
      />
    );
  };
}
