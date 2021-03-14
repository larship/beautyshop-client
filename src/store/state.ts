import CheckInItem from '@/models/CheckInItem';

export type State = {
  loading: boolean;
  checkInItem: CheckInItem | null;
  beautyhopCheckInList: CheckInItem[] | null;
};

export const state: State = {
  loading: JSON.parse(localStorage.getItem('loading') ?? 'false') as boolean,
  checkInItem: JSON.parse(localStorage.getItem('check-in-item') ?? 'null') as CheckInItem,
  beautyhopCheckInList: [],
};
