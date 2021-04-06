import { ActionContext, ActionTree } from 'vuex';
import { Mutations, MutationType } from './mutations';
import { State } from './state';
import { cancelCheckIn, createCheckIn, getBeautyshopCheckInList } from '@/services/checkIn';
import CheckInItem from '@/models/CheckInItem';
import { getBeautyshopList } from '@/services/beautyshop';
import { authClient, newClient } from '@/services/auth';
import Client from '@/models/Client';

export enum ActionTypes {
  CreateCheckIn = 'CREATE_CHECK_IN',
  CancelCheckIn = 'CANCEL_CHECK_IN',
  GetBeautyshopCheckInList = 'GET_BEAUTYSHOP_CHECKIN_LIST',
  GetBeautyshopList = 'GET_BEAUTYSHOP_LIST',
  AddToFavorite = 'ADD_TO_FAVORITE',
  RemoveFromFavorite = 'REMOVE_FROM_FAVORITE',
  SetLocation = 'SET_LOCATION',
  AuthorizeClient = 'AUTHORIZE_CLIENT',
  CreateNewClient = 'CREATE_NEW_CLIENT',
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

interface CancelCheckInParams {
  checkInUuid: string;
}

interface GetBeautyshopCheckInListParams {
  beautyshopUuid: string;
  dateFrom: string;
  dateTo: string;
}

interface GetBeautyshopListParams {
  location: string;
}

interface AddToFavoriteParams {
  beautyshopUuid: string;
}

interface RemoveFromFavoriteParams {
  beautyshopUuid: string;
}

interface SetLocationParams {
  location: string;
}

interface AuthorizeClientParams {
  clientUuid?: string;
  phone?: string;
  fullName?: string;
  sessionId?: string;
  salt?: string;
}

interface CreateNewClientParams {
  phone?: string;
  fullName?: string;
}

export type Actions = {
  [ActionTypes.CreateCheckIn](context: ActionAugments, data: CreateCheckInActionParams): void;
  [ActionTypes.CancelCheckIn](context: ActionAugments, data: CancelCheckInParams): void;
  [ActionTypes.GetBeautyshopCheckInList](context: ActionAugments, data: GetBeautyshopCheckInListParams): void;
  [ActionTypes.GetBeautyshopList](context: ActionAugments, data: GetBeautyshopListParams): void;
  [ActionTypes.AddToFavorite](context: ActionAugments, data: AddToFavoriteParams): void;
  [ActionTypes.RemoveFromFavorite](context: ActionAugments, data: RemoveFromFavoriteParams): void;
  [ActionTypes.SetLocation](context: ActionAugments, data: SetLocationParams): void;
  [ActionTypes.AuthorizeClient](context: ActionAugments, data: AuthorizeClientParams): Promise<Client | null>;
  [ActionTypes.CreateNewClient](context: ActionAugments, data: CreateNewClientParams): Promise<Client | null>;
}

export const actions: ActionTree<State, State> & Actions = {
  async [ActionTypes.CreateCheckIn]({commit}, data: CreateCheckInActionParams) {
    commit(MutationType.SetLoading, true);

    let item: CheckInItem | null = await createCheckIn(data);

    commit(MutationType.CreateCheckIn, item);
    commit(MutationType.SetLoading, false);
  },

  async [ActionTypes.CancelCheckIn]({commit}, data: CancelCheckInParams) {
    commit(MutationType.SetLoading, true);

    const status = await cancelCheckIn(data.checkInUuid);

    if (status) {
      commit(MutationType.CancelCheckIn, null);
    }

    commit(MutationType.SetLoading, false);
  },

  async [ActionTypes.GetBeautyshopCheckInList]({commit}, data: GetBeautyshopCheckInListParams) {
    commit(MutationType.SetLoading, true);

    let checkInList = await getBeautyshopCheckInList(data.beautyshopUuid, data.dateFrom, data.dateTo);
    commit(MutationType.SetBeautyshopCheckInList, checkInList);

    commit(MutationType.SetLoading, false);
  },

  async [ActionTypes.GetBeautyshopList]({commit}, data: GetBeautyshopListParams) {
    commit(MutationType.SetLoading, true);

    let beautyshops = await getBeautyshopList(data.location);
    commit(MutationType.SetBeautyshopList, beautyshops);

    commit(MutationType.SetLoading, false);
  },

  [ActionTypes.AddToFavorite]({commit}, data: AddToFavoriteParams) {
    commit(MutationType.AddToFavorite, data.beautyshopUuid);
  },

  [ActionTypes.RemoveFromFavorite]({commit}, data: RemoveFromFavoriteParams) {
    commit(MutationType.RemoveFromFavorite, data.beautyshopUuid);
  },

  [ActionTypes.SetLocation]({commit}, data: SetLocationParams) {
    commit(MutationType.SetLocation, data.location);
  },

  async [ActionTypes.AuthorizeClient]({commit}, data: AuthorizeClientParams): Promise<Client | null> {
    if (!data?.clientUuid || !data?.sessionId || !data?.salt) {
      console.log('AuthorizeClient fail: недостаточно данных');
      return null;
    }

    const client = await authClient(data.clientUuid, data.sessionId, data.salt);
    commit(MutationType.SetClient, client);
    return client;
  },

  async [ActionTypes.CreateNewClient]({commit}, data: CreateNewClientParams): Promise<Client | null> {
    if (!data?.phone || !data?.fullName) {
      console.log('CreateNewClient fail: недостаточно данных');
      return null;
    }

    const client = await newClient(data.phone, data.fullName);
    commit(MutationType.SetClient, client);
    return client;
  },
}
