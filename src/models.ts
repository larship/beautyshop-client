import Beautyshop from '@/models/Beautyshop';
import Worker from '@/models/Worker';
import ServiceType from '@/models/ServiceType';
import { Config } from '@/config';

function fetchDataList<T>(url: string): Promise<T[] | null> {
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

export function getBeautyshops(city: string): Promise<Beautyshop[]> {
  return fetchDataList<Beautyshop>('/beautyshops?city=' + city).then((data: Beautyshop[] | null) => {
    if (!data) {
      return [];
    }

    return data;
  });
}

export function getBeautyshop(uuid: string): Promise<Beautyshop | null> {
  return fetchDataList<Beautyshop>('/beautyshops?city=Москва').then((data: Beautyshop[] | null) => {
    if (!data) {
      return null;
    }

    // TODO Написать отдельное АПИ для получения салона по UUID

    const beautyshop = data.find((beautyshop: Beautyshop) => {
      if (beautyshop.uuid === uuid) {
        return beautyshop;
      }
    });

    return beautyshop ?? null;
  });
}

export function getWorkers(beautyShopUuid: string): Promise<Worker[] | null> {
  return fetchDataList<Worker>('/workers?beautyshop=' + beautyShopUuid);
}

export function getServiceTypes(beautyShopUuid: string): Promise<ServiceType[] | null> {
  return fetchDataList<ServiceType>('/service-types?beautyshop=' + beautyShopUuid);
}
