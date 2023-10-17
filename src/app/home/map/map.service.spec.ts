import * as L from "leaflet";
import { MapService } from "./map.service";

describe('MapService', function() {
  let service: MapService;
  let map: L.Map;

  beforeEach(function() {
    service = new MapService();
    const div = document.createElement('div');
    map = service.createMap(div);
  });

  describe('#createMap()', function() {
    it('should create a leaflet map', function() {
      expect(map).toBeInstanceOf(L.Map);
    });
  });

  describe('#addLayer()', function() {
    let layer1: L.Layer, layer2: L.Layer, layer3: L.Layer;

    beforeEach(function() {
      layer1 = L.circle([0, 0], { radius: 10 });
      layer2 = L.circle([1, 1], { radius: 20 });
      layer3 = L.circle([2, 2], { radius: 30 });
    });

    it('should add one layer', function() {
      service.addLayer(map, layer1);
      expect(map.hasLayer(layer1)).toBeTrue();
    });

    it('should add multiple layers', function() {
      service.addLayer(map, layer1, layer2, layer3);

      expect(map.hasLayer(layer1)).toBeTrue();
      expect(map.hasLayer(layer2)).toBeTrue();
      expect(map.hasLayer(layer3)).toBeTrue();
    });

    it('should add layer only if layer is not added already', function() {
      service.addLayer(map, layer1, layer2);

      spyOn(layer1, 'addTo');
      spyOn(layer2, 'addTo');
      spyOn(layer3, 'addTo');

      service.addLayer(map, layer1, layer2, layer3);

      expect(layer1.addTo).not.toHaveBeenCalled();
      expect(layer2.addTo).not.toHaveBeenCalled();
      expect(layer3.addTo).toHaveBeenCalledTimes(1);
    });

  });

});