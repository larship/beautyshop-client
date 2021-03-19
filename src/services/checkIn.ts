import CheckInItem from '@/models/CheckInItem';
import { fetchDataList, sendData } from '@/models';

interface CreateCheckInRequestParams {
  beautyshopUuid: string;
  clientUuid: string;
  workerUuid: string;
  serviceTypeUuid: string;
  startDate: Date;
}

export async function createCheckIn(params: CreateCheckInRequestParams): Promise<CheckInItem | null> {
  return await sendData<CheckInItem>('/check-in/create', {
    beautyshopUuid: params.beautyshopUuid,
    clientUuid: params.clientUuid,
    workerUuid: params.workerUuid,
    serviceTypeUuid: params.serviceTypeUuid,
    startDate: Math.floor(params.startDate.getTime() / 1000),
  });
}

export async function cancelCheckIn(uuid: string): Promise<boolean | null> {
  return await sendData<boolean>('/check-in/cancel', {
    uuid
  });
}

export async function getBeautyshopCheckInList(beautyshopUuid: string, dateFrom: string, dateTo: string): Promise<CheckInItem[] | null> {
  const params = new URLSearchParams({
    uuid: beautyshopUuid,
    dateFrom,
    dateTo

  })
  return await fetchDataList<CheckInItem>('/check-in/list-for-beautyshop?' + params.toString());
}
