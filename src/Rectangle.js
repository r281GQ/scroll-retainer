export default class Rectangle {
  constructor({ height, top }) {
    this._height = height;
    this._top = top;
  }

  getTop() {
    return this._top;
  }

  getHeight() {
    return this._height;
  }

  getBottom() {
    return this._top + this._height;
  }
}
