/* eslint-disable */
declare module ymaps {
  class Promise {
    then(onFulfilled?: Function, onRejected?: Function, onProgress?: Function, ctx?: object): Promise;
  }

  export function ready(onFulfilled?: Function): Promise;

  export class Map {
    constructor(element: string, state: MapState, options?: object);

    geoObjects: GeoObjectCollection;
  }

  export class MapState {
    center: number[];
    zoom: number;
    controls?: string[];
  }

  export class GeoObjectCollection {
    add(object: Placemark): void;
  }

  export class Placemark {
    constructor(coordinates: number[], properties?: object);
  }
}
