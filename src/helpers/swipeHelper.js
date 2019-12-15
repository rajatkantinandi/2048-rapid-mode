export default function SwipeHelper() {
  this.start = { x: 0, y: 0 };
  this.end = { x: 0, y: 0 };
}

SwipeHelper.prototype.handleTouchStart = function (event) {
  this.start.x = event.changedTouches[0].clientX;
  this.start.y = event.changedTouches[0].clientY;
}

SwipeHelper.prototype.handleTouchEnd = function (event) {
  if (event.changedTouches && event.changedTouches.length > 0) {
    this.end.x = event.changedTouches[0].clientX;
    this.end.y = event.changedTouches[0].clientY;
  }

  return this.getDirection();
}
function getTouchAngle(x2, y2, x1, y1) {
  return (180 * Math.atan2(y2 - y1, x2 - x1)) / Math.PI;
}

function isSwiped(x2, y2, x1, y1) {
  const thresHoldPX = 3;

  if (x2 - x1 < thresHoldPX && y2 - y1 < thresHoldPX) return false;
  else return true;
}

SwipeHelper.prototype.getDirection = function () {
  if (isSwiped(this.end.x, this.end.y, this.start.x, this.start.y)) {
    const angle = getTouchAngle(this.end.x, this.end.y, this.start.x, this.start.y);
    this.start = { x: 0, y: 0 }, this.end = { x: 0, y: 0 };

    if (angle >= -45 && angle < 45) {
      return "ArrowRight";
    } else if (angle >= 45 && angle < 135) {
      return "ArrowDown";
    } else if (angle >= 135 || angle < -135) {
      return "ArrowLeft";
    } else if (angle >= -135 && angle < -45) {
      return "ArrowUp";
    }
  }
}