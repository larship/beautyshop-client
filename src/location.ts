import { Config } from '@/config';

export function getLocation(): string {
  const location = localStorage.getItem('location');

  if (!location) {
    return Config.DEFAULT_LOCATION;
  }

  return location;
}

export function setLocation(city: string): void {
  localStorage.setItem('location', city);
}
