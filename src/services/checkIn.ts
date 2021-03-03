import CheckInItem from '@/models/CheckInItem';
import { sendData } from '@/models';

function saveCheckInLocal(checkInItem: CheckInItem): void {
  localStorage.setItem('check-in-uuid', checkInItem.uuid);
}

export function createCheckIn(beautyshopUuid: string, clientUuid: string, workerUuid: string,
                              serviceTypeUuid: string, startDate: Date): Promise<CheckInItem | null> {
  return sendData<CheckInItem>('/create-check-in', {
    beautyshopUuid,
    clientUuid,
    workerUuid,
    serviceTypeUuid,
    startDate: Math.floor(startDate.getTime() / 1000),
  }).then((checkInItem: CheckInItem | null) => {
    if (checkInItem) {
      saveCheckInLocal(checkInItem);
    }

    return checkInItem;
  });
}
