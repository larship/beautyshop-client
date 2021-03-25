import { MutationTree } from 'vuex'
import { State } from './state'
import CheckInItem from '@/models/CheckInItem';
import Beautyshop from '@/models/Beautyshop';

export enum MutationType {
  CreateCheckIn = 'CREATE_CHECK_IN',
  CancelCheckIn = 'CANCEL_CHECK_IN',
  SetLoading = 'SET_LOADING',
  SetBeautyshopCheckInList = 'SET_BEAUTYSHOP_CHECKIN_LIST',
  SetBeautyshopList = 'SET_BEAUTYSHOP_LIST',
  AddToFavorite = 'ADD_TO_FAVORITE',
  RemoveFromFavorite = 'REMOVE_FROM_FAVORITE',
  SetLocation = 'SET_LOCATION',
}

export type Mutations = {
  [MutationType.CreateCheckIn](state: State, checkInItem: CheckInItem | null): void;
  [MutationType.CancelCheckIn](state: State, checkInItem: CheckInItem | null): void;
  [MutationType.SetLoading](state: State, value: boolean): void;
  [MutationType.SetBeautyshopCheckInList](state: State, list: CheckInItem[] | null): void;
  [MutationType.SetBeautyshopList](state: State, list: Beautyshop[] | null): void;
  [MutationType.AddToFavorite](state: State, beautyshopUuid: string): void;
  [MutationType.RemoveFromFavorite](state: State, beautyshopUuid: string): void;
  [MutationType.SetLocation](state: State, location: string): void;
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
    state.beautyshopCheckInList = value;
  },

  [MutationType.SetBeautyshopList](state, value) {
    state.beautyshopList = value;
    localStorage.setItem('beautyshop-list', JSON.stringify(state.beautyshopList));
  },

  [MutationType.AddToFavorite](state, value) {
    state.beautyshopFavoriteList.push(value);
    localStorage.setItem('favorite-list', JSON.stringify(state.beautyshopFavoriteList));
  },

  [MutationType.RemoveFromFavorite](state, value) {
    const index = state.beautyshopFavoriteList.indexOf(value, 0);
    if (index != -1) {
      state.beautyshopFavoriteList.splice(index, 1);
    }
    localStorage.setItem('favorite-list', JSON.stringify(state.beautyshopFavoriteList));
  },

  [MutationType.SetLocation](state, value) {
    state.location = value;
    localStorage.setItem('location', JSON.stringify(state.location));
  }
}
