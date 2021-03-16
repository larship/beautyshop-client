import CheckInItem from '@/models/CheckInItem';
import Beautyshop from '@/models/Beautyshop';

export type State = {
  loading: boolean;
  checkInItem: CheckInItem | null;
  beautyshopCheckInList: CheckInItem[] | null;
  beautyshopList: Beautyshop[] | null;
  beautyshopFavoriteList: string[];
};

export const state: State = {
  loading: JSON.parse(localStorage.getItem('loading') ?? 'false') as boolean,
  checkInItem: JSON.parse(localStorage.getItem('check-in-item') ?? 'null') as CheckInItem,
  beautyshopCheckInList: [],
  beautyshopList: [],
  beautyshopFavoriteList: JSON.parse(localStorage.getItem('favorite-list') ?? '[]') as string[],
};
