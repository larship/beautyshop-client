import Worker from '@/models/Worker';
import { fetchDataList } from '@/api';

export function getWorkers(beautyShopUuid: string): Promise<Worker[] | null> {
  return fetchDataList<Worker>('/workers?beautyshopUuid=' + beautyShopUuid);
}
