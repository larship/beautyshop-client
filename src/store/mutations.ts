import { MutationTree } from 'vuex'
import { State } from './state'
import CheckInItem from '@/models/CheckInItem';

export enum MutationType {
  CreateCheckIn = 'CREATE_CHECK_IN',
  SetLoading = 'SET_LOADING',
}

export type Mutations = {
  [MutationType.CreateCheckIn](state: State, checkInItem: CheckInItem | null): void;
  [MutationType.SetLoading](state: State, value: boolean): void;
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationType.CreateCheckIn](state, checkInItem) {
    state.checkInItem = checkInItem ?? null;
    localStorage.setItem('check-in-item', JSON.stringify(state.checkInItem));
  },
  [MutationType.SetLoading](state, value) {
    state.loading = value;
    localStorage.setItem('loading', JSON.stringify(value));
  },
}
