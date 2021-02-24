import Beautyshop from '@/models/Beautyshop';
import Worker from '@/models/Worker';
import ServiceType from '@/models/ServiceType';
import { Config } from '@/config';

function fetchData<T>(url: string): Promise<T | null> {
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
  return fetchData<Beautyshop>('/beautyshop?uuid=' + uuid).then((beautyshop: Beautyshop | null) => {
    return beautyshop ?? null;
  });
}

export function getWorkers(beautyShopUuid: string): Promise<Worker[] | null> {
  return fetchDataList<Worker>('/workers?beautyshopUuid=' + beautyShopUuid);
}

export function getServiceTypes(beautyShopUuid: string): Promise<ServiceType[] | null> {
  return fetchDataList<ServiceType>('/service-types?beautyshopUuid=' + beautyShopUuid);
}
