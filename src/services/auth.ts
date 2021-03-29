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
  data.append('phone', phone);
  data.append('fullName', name);

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
