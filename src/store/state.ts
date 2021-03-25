import CheckInItem from '@/models/CheckInItem';
import Beautyshop from '@/models/Beautyshop';

export type State = {
  loading: boolean;
  location: string;
  checkInItem: CheckInItem | null;
  beautyshopCheckInList: CheckInItem[] | null;
  beautyshopList: Beautyshop[] | null;
  beautyshopFavoriteList: string[];
};

export const state: State = {
  loading: JSON.parse(localStorage.getItem('loading') ?? 'false') as boolean,
  location: JSON.parse(localStorage.getItem('location') ?? '""'),
  checkInItem: JSON.parse(localStorage.getItem('check-in-item') ?? 'null') as CheckInItem,
  beautyshopCheckInList: [],
  beautyshopList: JSON.parse(localStorage.getItem('beautyshop-list') ?? '[]') as Beautyshop[],
  beautyshopFavoriteList: JSON.parse(localStorage.getItem('favorite-list') ?? '[]') as string[],
};
