import React, { Component } from 'react';
import throttle from 'lodash.throttle';

import Rectangle from './Rectangle';
import List from './List';

function findIndex(list, predictor, startIndex = 0) {
  for (let index = 0 + startIndex; index < list.length; index++) {
    if (predictor(list[index], index)) {
      return index;
    }
  }

  return -1;
}

export default class ViewScroll extends Component {
  static defaultProps = {
    bufferCount: 4,
    defaultIndex: 0,
    averageHeight: 300
  };

  constructor(props) {
    super(props);

    this._handleScroll = throttle(this._handleScroll, 1, {
      trailing: true
    });
  }

  state = {
    endingIndex: 10,
    startIndex: 0,
    initialised: false,
    needFurtherPositioning: false
  };

  _recs = {};

  _heights = {};

  _itemRefs = {};

  _sliceList = ({ startIndex, endingIndex }) => ({ id }) =>
    id <= endingIndex && id >= startIndex;

  _handleScroll = forceUpdate => {
    const { _calculateRectangles, _heights } = this;

    const { bufferCount, data, viewPort } = this.props;

    this._recs = _calculateRectangles(data, _heights);

    const rects = this._recs;

    const viewPortRec = viewPort._getRect();

    let startIndex = findIndex(data, item => {
      return rects[item.id].getBottom() > viewPortRec.getTop();
    });

    if (startIndex < 0) {
      startIndex = data.length - 1;
    }

    let endingIndex = findIndex(
      data,
      item => {
        return rects[item.id].getTop() >= viewPortRec.getBottom();
      },
      startIndex
    );

    if (endingIndex < 0) {
      endingIndex = this.props.data.length;
    }

    const partialState = {
      startIndex: startIndex - bufferCount <= 0 ? 0 : startIndex - bufferCount,
      endingIndex:
        endingIndex + bufferCount >= this.props.data.length - 1
          ? this.props.data.length - 1
          : endingIndex + bufferCount
    };

    const haveIndexesChanged =
      partialState.startIndex !== this.state.startIndex ||
      partialState.endingIndex !== this.state.endingIndex;

    if (haveIndexesChanged || forceUpdate) {
      this._prevRecs = this._recs;
      this._prevItems = {
        startIndex: this.state.startIndex,
        endingIndex: this.state.endingIndex
      };

      this._prevViewPortRectangle = Object.assign(
        Object.create(viewPortRec),
        viewPortRec
      );

      this.setState(partialState);
    }
  };

  _calculateRectangles = (
    list,
    heights = {},
    averageHeight = this.props.averageHeight
  ) => {
    let top = 0;

    return list.reduce((sum, item) => {
      const { id } = item;

      const height = heights[id] ? heights[id] : averageHeight;

      const rec = new Rectangle({ height, top });

      sum[id] = rec;
      top += height;
      return sum;
    }, {});
  };

  _handleRefsChange = refs => {
    this._itemRefs = refs;
  };

  _getNewHeights() {
    const newHeights = {};

    Object.keys(this._itemRefs).forEach(id => {
      newHeights[id] = this._itemRefs[id].getBoundingClientRect().height;
    });

    this._heights = Object.assign({}, this._heights, newHeights);
  }

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

    let after = 0;

    const hasListChanged = !_recs[lastIndex];

    if (hasListChanged) {
      Object.keys(this._prevRecs).forEach(id => {
        after = this._prevRecs[id]._top;
      });

      after = after - _recs[endingIndex]._top;
    } else {
      after = _recs[lastIndex]._top - _recs[endingIndex]._top;
    }

    return {
      before: _recs[startIndex]._top,
      after
    };
  };

  _calculateHeightChange = () => {
    let prevHeight = 0;
    if (this._prevRecs) {
      Object.keys(this._prevRecs).forEach(id => {
        prevHeight += this._prevRecs[id].getHeight();
      });
    }

    this._recs = this._calculateRectangles(this.props.data, this._heights);

    let currentHeight = 0;

    Object.keys(this._recs).forEach(id => {
      currentHeight += this._recs[id].getHeight();
    });

    return prevHeight && currentHeight !== prevHeight
      ? currentHeight - prevHeight
      : 0;
  };

  _postRenderProcessing = newList => {
    if (newList) {
      return this._handleScroll(true);
    }

    this._getNewHeights();

    const heightDelta = this._calculateHeightChange();

    const hasUsedScrollRetention = !this._prevItems;

    const isBeingScrolledUp =
      (this._prevItems && this._prevItems.startIndex > this.state.startIndex) ||
      (this._prevItems && this._prevItems.endingIndex > this.state.endingIndex);

    if (heightDelta !== 0 && (hasUsedScrollRetention || isBeingScrolledUp))
      this.props.viewPort._scrollBy(heightDelta);

    if (this.state.needFurtherPositioning) {
      this._scrollToIndex(this.props.defaultIndex);
      this.setState({ needFurtherPositioning: false });
    }
  };

  _scrollToIndex = index => {
    const scrollTop = this._recs[index].getTop();

    this.props.viewPort._scrollTo(scrollTop);
  };

  componentDidMount = () => {
    this._scroller = this.props.viewPort._addScrollListener(event =>
      this._handleScroll(event.target.scrollTop)
    );

    this._recs = this._calculateRectangles(this.props.data, this._heights);

    this.setState({ initialised: true });

    this._postRenderProcessing();
  };

  componentDidUpdate = prevProps => {
    this._postRenderProcessing(prevProps.data !== this.props.data);
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
        onFirstPaddingApplied={() => {
          if (this.props.defaultIndex !== 0) {
            this._scrollToIndex(this.props.defaultIndex);
            this.setState({ needFurtherPositioning: true });
          }
        }}
      />
    );
  };
}
