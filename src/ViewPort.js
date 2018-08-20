import Rectangle from './Rectangle';

export default class ViewPort {
  constructor(scroller) {
    this._scroller = scroller;
    this._rec = new Rectangle({ top: 0, height: this._scroller.clientHeight });
    this._addScrollListener(event => {
      this._rec._top = event.target.scrollTop;
    });
  }

  _getRect = () => {
    return this._rec;
  };

  _getScrollerHeight = () => {
    return this._scroller.clientHeight;
  };

  _scrollTo = index => {
    this._scroller.scrollTop = index;
  };

  _scrollBy = index => {
    this._scroller.scrollTop = this._scroller.scrollTop + index;
  };

  _addScrollListener = listenerFunction => {
    this._scroller.addEventListener('scroll', listenerFunction);

    return () => this._scroller.removeEventListener('scroll', listenerFunction);
  };
}
