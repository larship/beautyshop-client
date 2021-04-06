import ServiceType from '@/models/ServiceType';
import { fetchDataList } from '@/api';

export function getServiceTypes(beautyShopUuid: string): Promise<ServiceType[] | null> {
  return fetchDataList<ServiceType>('/beautyshop/service-types?beautyshopUuid=' + beautyShopUuid);
}
