import CheckInItem from '@/models/CheckInItem';
import { sendData } from '@/models';

interface CreateCheckInRequestParams {
  beautyshopUuid: string;
  clientUuid: string;
  workerUuid: string;
  serviceTypeUuid: string;
  startDate: Date;
}

export async function createCheckIn(params: CreateCheckInRequestParams): Promise<CheckInItem | null> {
  return await sendData<CheckInItem>('/create-check-in', {
    beautyshopUuid: params.beautyshopUuid,
    clientUuid: params.clientUuid,
    workerUuid: params.workerUuid,
    serviceTypeUuid: params.serviceTypeUuid,
    startDate: Math.floor(params.startDate.getTime() / 1000),
  });
}