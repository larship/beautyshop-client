/* eslint-disable */
/// <reference path="../declarations/ymaps.d.ts" />
export function createMap(element: string, coordinates: number[]): void {
  ymaps.ready(function () {
    let myMap: ymaps.Map = new ymaps.Map(element, {
        center: coordinates,
        zoom: 18,
        controls: []
      }),
      myPlacemark = new ymaps.Placemark(coordinates, {});

    // myMap.behaviors.enable('ruler');
    myMap.geoObjects.add(myPlacemark);
  });
}
