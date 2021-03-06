/* eslint-disable */
declare module ymaps {
  class Promise {
    then(onFulfilled?: Function, onRejected?: Function, onProgress?: Function, ctx?: object): Promise;
  }

  export function ready(onFulfilled?: Function): Promise;

  export class Map {
    constructor(element: string, state: MapState, options?: MapOptions);

    geoObjects: GeoObjectCollection;
  }

  export class MapState {
    center?: number[];
    zoom?: number;
    controls?: string[];
    bounds?: number[][];
  }

  export class MapOptions {
    minZoom?: number;
    maxZoom?: number;
  }

  export class GeoObjectCollection {
    add(object: Placemark): void;
  }

  export class Placemark {
    constructor(coordinates: number[], properties?: object);
  }

  interface CenterAndZoom {
    center: number[];
    zoom: number;
  }

  export class util {
    static bounds: {
      getCenterAndZoom(bounds: number[][], containerSize: number[]): CenterAndZoom;
    }
  }
}
