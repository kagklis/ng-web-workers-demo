interface Point {
   x: number;
   y: number;
}

interface IndexedPoint extends Point {
   index: number;
}

interface DataActivePoint {
   datasetIndex: number;
   index: number;
}

export function getNearestElementByX(
   meta: { data: IndexedPoint[] },
   mousePoint: Point
): IndexedPoint {
   const nearestElement = meta.data.reduce((a, b) =>
      Math.abs(b.x - mousePoint.x) < Math.abs(a.x - mousePoint.x) ? b : a
   );
   return {
      x: nearestElement.x,
      y: nearestElement.y,
      index: meta.data.findIndex((element) => element === nearestElement),
   };
}

export function getNearestTouched(
   nearest1: IndexedPoint,
   nearest2: IndexedPoint,
   mousePoint: Point
): DataActivePoint {
   let result;
   if (isTouched(nearest1, mousePoint) && isTouched(nearest2, mousePoint)) {
      result = getNearestDataPointToMouse(nearest1, nearest2, mousePoint);
   } else if (isTouched(nearest1, mousePoint)) {
      result = { datasetIndex: 0, index: nearest1.index };
   } else {
      result = { datasetIndex: 1, index: nearest2.index };
   }
   return result;
}

export function isTouched(element: IndexedPoint, mousePoint: Point): boolean {
   return element.y < mousePoint.y;
}

export function getNearestDataPointToMouse(
   nearest1: IndexedPoint,
   nearest2: IndexedPoint,
   mousePoint: Point
): DataActivePoint {
   return Math.abs(nearest1.x - mousePoint.x) <
      Math.abs(nearest2.x - mousePoint.x)
      ? { datasetIndex: 0, index: nearest1.index }
      : { datasetIndex: 1, index: nearest2.index };
}
