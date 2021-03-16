import { GetterTree } from 'vuex';
import { State } from './state';
import CheckInItem from '@/models/CheckInItem';
import dayjs from 'dayjs';
import Beautyshop from '@/models/Beautyshop';

export type Getters = {
  getCheckInItem(state: State): () => CheckInItem | null;
  getBeautyshopCheckInList(state: State): () => CheckInItem[] | null;
  getIsLoading(state: State): () => boolean;
  getBeautyshopList(state: State): () => Beautyshop[] | null;
}

export const getters: GetterTree<State, State> & Getters = {
  getCheckInItem: (state: State) => () => {
    if (state.checkInItem?.startDate && dayjs(state.checkInItem.startDate).isBefore(dayjs())) {
      return null;
    }

    return state.checkInItem;
  },

  getBeautyshopCheckInList: (state: State) => () => {
    return state.beautyshopCheckInList;
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
}
