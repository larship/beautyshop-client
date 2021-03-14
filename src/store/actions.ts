import { ActionContext, ActionTree } from 'vuex';
import { Mutations, MutationType } from './mutations';
import { State } from './state';
import { cancelCheckIn, createCheckIn, getBeautyshopCheckInList } from '@/services/checkIn';
import CheckInItem from '@/models/CheckInItem';

export enum ActionTypes {
  CreateCheckIn = 'CREATE_CHECK_IN',
  CancelCheckIn = 'CANCEL_CHECK_IN',
  GetBeautyshopCheckInList = 'GET_BEAUTYSHOP_CHECKIN_LIST',
}

type ActionAugments = Omit<ActionContext<State, State>, 'commit'> & {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
}

interface CreateCheckInActionParams {
  beautyshopUuid: string;
  clientUuid: string;
  workerUuid: string;
  serviceTypeUuid: string;
  startDate: Date;
}

interface CancelCheckIn {
  checkInUuid: string;
}

interface GetBeautyshopCheckInListParams {
  beautyshopUuid: string;
  startDate: string;
  endDate: string;
}

export type Actions = {
  [ActionTypes.CreateCheckIn](context: ActionAugments, data: CreateCheckInActionParams): void;
  [ActionTypes.CancelCheckIn](context: ActionAugments, data: CancelCheckIn): void;
  [ActionTypes.GetBeautyshopCheckInList](context: ActionAugments, data: GetBeautyshopCheckInListParams): void;
}

export const actions: ActionTree<State, State> & Actions = {
  async [ActionTypes.CreateCheckIn]({commit}, data: CreateCheckInActionParams) {
    commit(MutationType.SetLoading, true);

    let item: CheckInItem | null = await createCheckIn(data);

    commit(MutationType.CreateCheckIn, item);
    commit(MutationType.SetLoading, false);
  },

  async [ActionTypes.CancelCheckIn]({commit}, data: CancelCheckIn) {
    commit(MutationType.SetLoading, true);

    const status = await cancelCheckIn(data.checkInUuid);

    if (status) {
      commit(MutationType.CancelCheckIn, null);
    }

    commit(MutationType.SetLoading, false);
  },

  async [ActionTypes.GetBeautyshopCheckInList]({commit}, data: GetBeautyshopCheckInListParams) {
    commit(MutationType.SetLoading, true);

    let checkInList = await getBeautyshopCheckInList(data.beautyshopUuid, data.startDate, data.endDate);
    commit(MutationType.SetBeautyshopCheckInList, checkInList);

    commit(MutationType.SetLoading, false);
  }
}
