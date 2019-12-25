export default function SwipeHelper(thresholdPX) {
  this.x1 = 0;
  this.x2 = 0;
  this.y1 = 0;
  this.y2 = 0;
  this.thresholdPX = thresholdPX;
}

SwipeHelper.prototype.handleTouchStart = function (event) {
  this.x1 = event.changedTouches[0].clientX;
  this.y1 = event.changedTouches[0].clientY;
}

SwipeHelper.prototype.handleTouchEnd = function (event) {
  if (event.changedTouches && event.changedTouches.length > 0) {
    this.x2 = event.changedTouches[0].clientX;
    this.y2 = event.changedTouches[0].clientY;
  }

  return this.getDirection();
}

SwipeHelper.prototype.getDirection = function () {
  const { x1, x2, y1, y2 } = this;

  if (Math.abs(x2 - x1) > Math.abs(y2 - y1) && Math.abs(x2 - x1) > this.thresholdPX) {
    return x2 > x1 ? "ArrowRight" : "ArrowLeft";
  } else if (Math.abs(y2 - y1) > this.thresholdPX) {
    return y2 > y1 ? "ArrowDown" : "ArrowUp";
  }
}