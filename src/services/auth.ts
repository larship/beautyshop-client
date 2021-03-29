import Client from '@/models/Client';
import { Config } from '@/config';

export function authClient(clientUuid: string, sessionId: string, salt: string): Promise<Client | null> {
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

export function newClient(phone: string, name: string): Promise<Client | null> {
  const data: FormData = new FormData();
  data.append('fullName', phone);
  data.append('phone', name);

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

/**
 * @deprecated
 */
export function checkAuth(): Promise<Client | null> {
  const clientUuid = localStorage.getItem('client-uuid');
  const sessionId = localStorage.getItem('session-id');
  const salt = localStorage.getItem('salt');
  const phone = localStorage.getItem('phone') ?? '';
  const name = localStorage.getItem('name') ?? '';

  console.log('LocalStorage: clientUuid, sessionId, salt: ' + clientUuid + ', ' + sessionId + ', ' + salt);

  if (clientUuid == null || sessionId == null || salt == null) {
    return newClient(phone, name).then((client: Client | null) => {
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

// export function getClientData(): ExtendedClientData | null {
//   const phone = localStorage.getItem('phone');
//   const name = localStorage.getItem('name');
//
//   if (!phone || !name) {
//     return null;
//   }
//
//   return {phone: phone, name: name};
// }

// export function getClientDataExtended(): ExtendedClientData | null {
//   // TODO Вынести в STORE
//
//   const clientUuid = localStorage.getItem('client-uuid');
//   const sessionId = localStorage.getItem('session-id');
//   const salt = localStorage.getItem('salt');
//   const phone = localStorage.getItem('phone');
//   const name = localStorage.getItem('name');
//
//   if (!clientUuid || !sessionId || !salt || !phone || !name) {
//     return null;
//   }
//
//   return {clientUuid, sessionId, salt, phone, name};
// }
