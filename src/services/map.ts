/* eslint-disable */

/// <reference path="../declarations/ymaps.d.ts" />

interface MapObject {
  title: string;
  coordinates: number[];
}

export function createMap(element: string, mapObjects: MapObject[]): void {
  ymaps.ready(function () {
    const containerSize = [400, 400];
    const initialZoom = 18;
    let minLat: number = 0, minLon: number = 0;
    let maxLat: number = 0, maxLon: number = 0;

    mapObjects.forEach((mapObject) => {
      minLat = !minLat ? mapObject.coordinates[0] : (minLat > mapObject.coordinates[0] ? mapObject.coordinates[0] : minLat);
      minLon = !minLon ? mapObject.coordinates[1] : (minLon > mapObject.coordinates[1] ? mapObject.coordinates[1] : minLon);
      maxLat = !maxLat ? mapObject.coordinates[0] : (maxLat < mapObject.coordinates[0] ? mapObject.coordinates[0] : maxLat);
      maxLon = !maxLon ? mapObject.coordinates[1] : (maxLon < mapObject.coordinates[1] ? mapObject.coordinates[1] : maxLon);
    });

    const centerAndZoom = ymaps.util.bounds.getCenterAndZoom([[minLat, minLon], [maxLat, maxLon]], containerSize);

    if (mapObjects.length === 1) {
      centerAndZoom.center = mapObjects[0].coordinates;
      centerAndZoom.zoom = initialZoom;
    }

    let map = new ymaps.Map(element, {
      center: centerAndZoom.center,
      zoom: centerAndZoom.zoom,
      controls: []
    });

    for (let mapObject of mapObjects) {
      let placemark = new ymaps.Placemark(mapObject.coordinates, {
        balloonContent: mapObject.title
      });
      map.geoObjects.add(placemark);
    }

    // map.behaviors.enable('ruler');
  });
}
