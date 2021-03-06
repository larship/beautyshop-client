import { GetterTree } from 'vuex';
import { State } from './state';
import CheckInItem from '@/models/CheckInItem';
import Beautyshop from '@/models/Beautyshop';
import Client from '@/models/Client';

export type Getters = {
  getCheckInList(state: State): () => CheckInItem[] | null;
  getIsLoading(state: State): () => boolean;
  getBeautyshopList(state: State): () => Beautyshop[] | null;
  getBeautyshop(state: State): (uuid: string) => Beautyshop | null;
  getLocation(state: State): () => string;
  getClient(state: State): () => Client | null;
}

export const getters: GetterTree<State, State> & Getters = {
  getCheckInList: (state: State) => () => {
    return state.checkInList;
  },

  getIsLoading: (state: State) => () => {
    return state.loading;
  },

  getBeautyshopList: (state: State) => () => {
    state.beautyshopList?.forEach((beautyshop: Beautyshop) => {
      beautyshop.favorite = state.beautyshopFavoriteList.indexOf(beautyshop.uuid) != -1;
    });

    return state.beautyshopList;
  },

  getBeautyshop: (state: State) => (uuid: string) => {
    const beautyshopListFiltered = state.beautyshopList?.filter((beautyshop: Beautyshop) => {
      return beautyshop.uuid === uuid;
    });
    const beautyshop = beautyshopListFiltered?.[0];

    return beautyshop || null;
  },

  getLocation: (state: State) => () => {
    return state.location;
  },

  getClient: (state: State) => () => {
    return state.client;
  }
}
