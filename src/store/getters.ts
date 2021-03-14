import { GetterTree } from 'vuex';
import { State } from './state';
import CheckInItem from '@/models/CheckInItem';
import dayjs from 'dayjs';

export type Getters = {
  getCheckInItem(state: State): () => CheckInItem | null;
  getBeautyshopCheckInList(state: State): () => CheckInItem[] | null;
}

export const getters: GetterTree<State, State> & Getters = {
  getCheckInItem: (state: State) => () => {
    if (state.checkInItem?.startDate && dayjs(state.checkInItem.startDate).isBefore(dayjs())) {
      return null;
    }

    return state.checkInItem;
  },
  getBeautyshopCheckInList: (state: State) => () => {
    return state.beautyhopCheckInList;
  }
}
