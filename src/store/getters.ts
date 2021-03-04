import { GetterTree } from 'vuex';
import { State } from './state';
import CheckInItem from '@/models/CheckInItem';

export type Getters = {
  getCheckInItem(state: State): () => CheckInItem | null;
}

export const getters: GetterTree<State, State> & Getters = {
  getCheckInItem: (state) => () => {
    return state.checkInItem;
  },
}
