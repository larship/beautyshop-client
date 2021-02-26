import Client from '@/models/Client';
import { Config } from '@/config';

export interface ClientData {
  phone: string;
  name: string;
}

export interface ExtendedClientData {
  phone: string;
  name: string;
  clientUuid: string;
  sessionId: string;
  salt: string;
}

function authClient(clientUuid: string, sessionId: string, salt: string): Promise<Client | null> {
  const data: FormData = new FormData();
  data.append('clientUuid', clientUuid);
  data.append('sessionId', sessionId);
  data.append('salt', salt);

  return fetch(Config.BACKEND_URL + '/client/auth', {
    method: 'POST',
    body: data,
  }).then(res => {
    if (!res.ok) {
      return null;
    }

    return res.json();
  }).then((json: Client) => {
    return json;
  });
}

function newClient(): Promise<Client | null> {
  const data: FormData = new FormData();
  const clientPhone = localStorage.getItem('phone');
  const clientName = localStorage.getItem('name');

  if (!clientPhone || !clientName) {
    return Promise.resolve(null);
  }

  data.append('fullName', clientPhone);
  data.append('phone', clientName);

  return fetch(Config.BACKEND_URL + '/client/new', {
    method: 'POST',
    body: data,
  }).then(res => {
    if (!res.ok) {
      return null;
    }

    return res.json();
  }).then((client: Client) => {
    return client;
  });
}

export function checkAuth(): Promise<Client | null> {
  const clientUuid = localStorage.getItem('client-uuid');
  const sessionId = localStorage.getItem('session-id');
  const salt = localStorage.getItem('salt');

  console.log('LocalStorage: clientUuid, sessionId, salt: ' + clientUuid + ', ' + sessionId + ', ' + salt);

  if (clientUuid == null || sessionId == null || salt == null) {
    return newClient().then((client: Client | null) => {
      if (client == null) {
        return null;
      }

      console.log('Created Client: clientUuid, sessionId, salt: ' + client.uuid + ', ' + client.sessionId + ', ' + client.salt);

      localStorage.setItem('client-uuid', client.uuid);
      localStorage.setItem('session-id', client.sessionId);
      localStorage.setItem('salt', client.salt);

      return client;
    });
  }

  return authClient(clientUuid, sessionId, salt);
}

export function getClientData(): ClientData | null {
  const phone = localStorage.getItem('phone');
  const name = localStorage.getItem('name');

  if (!phone || !name) {
    return null;
  }

  return {phone: phone, name: name};
}

export function setClientData(clientData: ClientData): void {
  localStorage.setItem('phone', clientData.phone);
  localStorage.setItem('name', clientData.name);

  // TODO Обновлять сущность клиента на сервере
}

export function getClientDataExtended(): ExtendedClientData | null {
  // TODO Подумать над объединением ClientData и ExtendedClientData. ClientData выглядит ненужным

  const clientUuid = localStorage.getItem('client-uuid');
  const sessionId = localStorage.getItem('session-id');
  const salt = localStorage.getItem('salt');
  const phone = localStorage.getItem('phone');
  const name = localStorage.getItem('name');

  if (!clientUuid || !sessionId || !salt || !phone || !name) {
    return null;
  }

  return {clientUuid, sessionId, salt, phone, name};
}
