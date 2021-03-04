import { ActionContext, ActionTree } from 'vuex';
import { Mutations, MutationType } from './mutations';
import { State } from './state';
import { createCheckIn } from '@/services/checkIn';
import CheckInItem from '@/models/CheckInItem';

export enum ActionTypes {
  CreateCheckIn = 'CREATE_CHECK_IN',
  SetLoading = 'SET_LOADING',
}

type ActionAugments = Omit<ActionContext<State, State>, 'commit'> & {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
}

interface CheckInActionParams {
  beautyshopUuid: string;
  clientUuid: string;
  workerUuid: string;
  serviceTypeUuid: string;
  startDate: Date;
}

export type Actions = {
  [ActionTypes.CreateCheckIn](context: ActionAugments, data: CheckInActionParams): void;
}

export const actions: ActionTree<State, State> & Actions = {
  async [ActionTypes.CreateCheckIn]({commit}, data: CheckInActionParams) {
    commit(MutationType.SetLoading, true);

    let item: CheckInItem | null = await createCheckIn(data);

    commit(MutationType.SetLoading, false);
    commit(MutationType.CreateCheckIn, item);
  },
}
