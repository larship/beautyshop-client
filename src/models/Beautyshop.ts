import BeautyshopWorker from '@/models/Worker';

export default interface Beautyshop {
  uuid: string;
  name: string;
  city: string;
  address: string;
  phones: string[] | null;
  coordinates: number[] | null;
  openHour: number;
  closeHour: number;
  workers: BeautyshopWorker[];
  favorite: boolean;
  admins: string[];
}
