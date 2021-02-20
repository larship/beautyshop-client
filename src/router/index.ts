import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Hello from '@/components/Hello.vue';
import List from '@/components/List.vue';
import ApiTest from '@/components/ApiTest.vue';
import CheckIn from '@/components/CheckIn.vue';
import Info from '@/components/Info.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/hello',
    name: 'Hello',
    component: Hello
  },
  {
    path: '/list',
    name: 'Beauty shops list',
    component: List
  },
  {
    path: '/check-in/:uuid',
    name: 'Checkin page',
    component: CheckIn,
    props: true
  },
  {
    path: '/info/:uuid',
    name: 'Info page',
    component: Info,
    props: true
  },
  {
    path: '/api-test',
    name: 'API test',
    component: ApiTest
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
