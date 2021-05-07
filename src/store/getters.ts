import { GetterTree } from 'vuex';
import { State } from './state';
import CheckInItem from '@/models/CheckInItem';
import dayjs from 'dayjs';
import Beautyshop from '@/models/Beautyshop';
import Client from '@/models/Client';

export type Getters = {
  getCheckInItem(state: State): () => CheckInItem | null;
  getCheckInList(state: State): () => CheckInItem[] | null;
  getIsLoading(state: State): () => boolean;
  getBeautyshopList(state: State): () => Beautyshop[] | null;
  getBeautyshop(state: State): (uuid: string) => Beautyshop | null;
  getLocation(state: State): () => string;
  getClient(state: State): () => Client | null;
}

export const getters: GetterTree<State, State> & Getters = {
  // @deprecated
  // Используется только на панели, там надо переделать на получение списка и отказаться от использования данного метода
  getCheckInItem: (state: State) => () => {
    if (state.checkInItem?.startDate && dayjs(state.checkInItem.startDate).isBefore(dayjs())) {
      return null;
    }

    return state.checkInItem;
  },

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
