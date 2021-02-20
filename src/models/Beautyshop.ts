import BeautyshopWorker from '@/models/Worker';

export default interface Beautyshop {
  uuid: string;
  city: string;
  address: string;
  name: string;
  workers: BeautyshopWorker[];
}
