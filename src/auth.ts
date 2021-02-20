import Client from '@/models/Client';
import { Config } from '@/config';

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

  console.log('clientUuid, sessionId, salt: ' + clientUuid + ', ' + sessionId + ', ' + salt);

  if (clientUuid == null || sessionId == null || salt == null) {
    return newClient().then((client: Client | null) => {
      if (client == null) {
        return null;
      }

      localStorage.setItem('client-uuid', client.uuid);
      localStorage.setItem('session-id', client.sessionId);
      localStorage.setItem('salt', client.salt);

      return client;
    });
  }

  return authClient(clientUuid, sessionId, salt);
}

export function setClientData(phone: string, name: string): void {
  localStorage.setItem('phone', phone);
  localStorage.setItem('name', name);
}
