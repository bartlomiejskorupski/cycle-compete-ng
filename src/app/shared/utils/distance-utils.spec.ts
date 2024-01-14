import { distanceToPath } from "./distance-utils";

describe('distance-utils', () => {

  describe('#distanceToPath', () => {

    it('should work', () => {
      const userPosition = [54.315179, 18.572316] as L.LatLngTuple;
      const polyline: L.LatLngTuple[] = [
        [54.315392, 18.570069],
        [54.314710, 18.572415],
        [54.315016, 18.571961],
        [54.315303, 18.571550],
        [54.314222, 18.571760],
      ];

      const distance = distanceToPath(userPosition, polyline);

      expect(distance).toBeCloseTo(29.3);
    });

  });

});