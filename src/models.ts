import Beautyshop from '@/models/Beautyshop';
import Worker from '@/models/Worker';
import ServiceType from '@/models/ServiceType';
import { Config } from '@/config';

export function sendData<T>(url: string, data: object): Promise<T | null> {
  return fetch(Config.BACKEND_URL + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  }).then(res => {
    if (!res.ok) {
      return null;
    }

    return res.json();
  }).then((json: T) => {
    return json;
  });
}

export function fetchData<T>(url: string): Promise<T | null> {
  return fetch(Config.BACKEND_URL + url, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  }).then(res => {
    if (!res.ok) {
      return null;
    }

    return res.json();
  }).then((json: T) => {
    return json;
  });
}

export function fetchDataList<T>(url: string): Promise<T[] | null> {
  return fetch(Config.BACKEND_URL + url, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  }).then(res => {
    if (!res.ok) {
      return null;
    }

    return res.json();
  }).then((json: T[]) => {
    return json;
  });
}

export function getBeautyshopList(city: string): Promise<Beautyshop[]> {
  return fetchDataList<Beautyshop>('/beautyshops?city=' + city).then((data: Beautyshop[] | null) => {
    if (!data) {
      return [];
    }

    let coordsStr;
    data.forEach(beautyshop => {
      if (beautyshop.coordinates) {
        coordsStr = beautyshop.coordinates as unknown as string;
        beautyshop.coordinates = coordsStr.replace(/[^0-9,.]/g, '').split(',').map(entry => Number(entry));
      }
    });

    return data;
  });
}

// export function getBeautyshop(uuid: string): Promise<Beautyshop | null> {
//   return fetchData<Beautyshop>('/beautyshop?uuid=' + uuid).then((beautyshop: Beautyshop | null) => {
//     if (beautyshop && beautyshop.coordinates) {
//       let coordsStr = beautyshop.coordinates as unknown as string;
//       beautyshop.coordinates = coordsStr.replace(/[^0-9,.]/g, '').split(',').map(entry => Number(entry));
//     }
//
//     return beautyshop as Beautyshop ?? null;
//   });
// }

export function getWorkers(beautyShopUuid: string): Promise<Worker[] | null> {
  return fetchDataList<Worker>('/workers?beautyshopUuid=' + beautyShopUuid);
}

export function getServiceTypes(beautyShopUuid: string): Promise<ServiceType[] | null> {
  return fetchDataList<ServiceType>('/beautyshop/service-types?beautyshopUuid=' + beautyShopUuid);
}

