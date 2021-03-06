import CheckInItem from '@/models/CheckInItem';
import Beautyshop from '@/models/Beautyshop';
import Client from '@/models/Client';
import { Config } from '@/config';

export type State = {
  loading: boolean;
  location: string;
  client: Client | null;
  checkInItem: CheckInItem | null;
  checkInList: CheckInItem[] | null;
  beautyshopList: Beautyshop[] | null;
  beautyshopFavoriteList: string[];
};

export const state: State = {
  loading: JSON.parse(localStorage.getItem('loading') ?? 'false') as boolean,
  location: JSON.parse(localStorage.getItem('location') ?? '"' + Config.DEFAULT_LOCATION + '"'),
  client: JSON.parse(localStorage.getItem('client') ?? 'null') as Client,
  checkInItem: JSON.parse(localStorage.getItem('check-in-item') ?? 'null') as CheckInItem,
  checkInList: [],
  beautyshopList: JSON.parse(localStorage.getItem('beautyshop-list') ?? '[]') as Beautyshop[],
  beautyshopFavoriteList: JSON.parse(localStorage.getItem('favorite-list') ?? '[]') as string[],
};
