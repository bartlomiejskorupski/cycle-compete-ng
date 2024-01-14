import { LatLngTuple, latLng } from 'leaflet';

/**
 * Calculates distance from a point to a polyline in meters.
 * @param point A tuple of two numbers representing latitude and longitude. LatLngTuple = [number, number]
 * @param polyline An array of latlng tuples representing points of a polyline. LatLngTuple[]
 * @returns Distance in meters.
 * @throws Argument exception, if point or polyline is null.
 */
export function distanceToPath(point: LatLngTuple, polyline: LatLngTuple[]): number {
  if(!point || !polyline) {
    throw new Error('Argument exception');
  }

  if(polyline.length === 1) {
    return distanceOfPoints(point, polyline[0]);
  }

  const segmentDistances: number[] = [];
  for(let i = 1; i < polyline.length; i++) {
    const lineSegmentDistance = distanceToLineSegment(point, [polyline[i - 1], polyline[i]]);
    segmentDistances.push(lineSegmentDistance);
  }

  return Math.min(...segmentDistances);
}

function distanceToLineSegment(point: LatLngTuple, line: [LatLngTuple, LatLngTuple]): number {
  let distance = 0;
  
  const lineLength = distanceOfPoints(line[0], line[1]);
  const p1Dist = distanceOfPoints(point, line[0]);
  const p2Dist = distanceOfPoints(point, line[1]);

  if(p1Dist > lineLength || p2Dist > lineLength) {
    return Math.min(p1Dist, p2Dist);
  }

  return distanceOfPoints(point, nearestPointOnLine(point, line));
}

function nearestPointOnLine(point: LatLngTuple, line: [LatLngTuple, LatLngTuple]): LatLngTuple {
  // Convert latitude and longitude from degrees to radians
  const lat1 = line[0][0] * Math.PI / 180;
  const lng1 = line[0][1] * Math.PI / 180;
  const lat2 = line[1][0] * Math.PI / 180;
  const lng2 = line[1][1] * Math.PI / 180;
  const lat3 = point[0] * Math.PI / 180;
  const lng3 = point[1] * Math.PI / 180;

  // Calculate vectors
  const v1 = { x: lng2 - lng1, y: lat2 - lat1 }; // Vector along the line
  const v2 = { x: lng3 - lng1, y: lat3 - lat1 }; // Vector from line start to the target point

  // Calculate the dot product
  const dotProduct = v2.x * v1.x + v2.y * v1.y;

  // Calculate the scalar projection of v2 onto v1
  const scalarProjection = dotProduct / (v1.x * v1.x + v1.y * v1.y);

  // Calculate the coordinates of the nearest point on the line
  const nearestPoint = {
    lat: lat1 + scalarProjection * (lat2 - lat1),
    lng: lng1 + scalarProjection * (lng2 - lng1)
  };

  // Convert coordinates back to degrees
  nearestPoint.lat *= 180 / Math.PI;
  nearestPoint.lng *= 180 / Math.PI;

  return [nearestPoint.lat, nearestPoint.lng];
}

function distanceOfPoints(p1: LatLngTuple, p2: LatLngTuple): number {
  return latLng(p1).distanceTo(latLng(p2));
}
