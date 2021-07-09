import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Hello from '@/components/Hello.vue';
import List from '@/components/List.vue';
import ApiTest from '@/components/ApiTest.vue';
import CheckIn from '@/components/CheckIn.vue';
import Info from '@/components/Info.vue';
import CheckInList from '@/components/user/CheckInList.vue';
import Settings from '@/components/Settings.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Hello',
    component: Hello
  },
  {
    path: '/list',
    name: 'List',
    component: List
  },
  {
    path: '/check-in/:uuid',
    name: 'CheckIn',
    component: CheckIn,
    props: true
  },
  {
    path: '/info/:uuid',
    name: 'Info',
    component: Info,
    props: true
  },
  {
    path: '/user/check-in-list',
    name: 'UserCheckInList',
    component: CheckInList,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/api-test',
    name: 'ApiTest',
    component: ApiTest
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
