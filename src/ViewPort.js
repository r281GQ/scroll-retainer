export default class ViewPort {
  constructor(scroller) {
    this._scroller = scroller;
  }

  _getScrollerHeight = () => {
    return this._scroller.clientHeight;
  };

  _scrollTo = index => {
    this._scroller.scrollTop = index;
  };

  _addScrollListener = listenerFunction => {
    this._scroller.addEventListener('scroll', listenerFunction);

    return () => this._scroller.removeEventListener('scroll', listenerFunction);
  };
}
