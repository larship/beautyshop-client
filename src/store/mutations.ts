import { MutationTree } from 'vuex'
import { State } from './state'
import CheckInItem from '@/models/CheckInItem';

export enum MutationType {
  CreateCheckIn = 'CREATE_CHECK_IN',
  CancelCheckIn = 'CANCEL_CHECK_IN',
  SetLoading = 'SET_LOADING',
  SetBeautyshopCheckInList = 'SET_BEAUTYSHOP_CHECKIN_LIST',
}

export type Mutations = {
  [MutationType.CreateCheckIn](state: State, checkInItem: CheckInItem | null): void;
  [MutationType.CancelCheckIn](state: State, checkInItem: CheckInItem | null): void;
  [MutationType.SetLoading](state: State, value: boolean): void;
  [MutationType.SetBeautyshopCheckInList](state: State, list: CheckInItem[] | null): void;
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationType.CreateCheckIn](state, checkInItem) {
    state.checkInItem = checkInItem ?? null;
    localStorage.setItem('check-in-item', JSON.stringify(state.checkInItem));
  },
  [MutationType.CancelCheckIn](state) {
    state.checkInItem = null;
    localStorage.setItem('check-in-item', JSON.stringify(state.checkInItem));
  },
  [MutationType.SetLoading](state, value) {
    state.loading = value;
    localStorage.setItem('loading', JSON.stringify(value));
  },
  [MutationType.SetBeautyshopCheckInList](state, value) {
    state.beautyhopCheckInList = value;
  },
}
