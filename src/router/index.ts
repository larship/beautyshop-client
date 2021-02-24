import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Hello from '@/components/Hello.vue';
import List from '@/components/List.vue';
import ApiTest from '@/components/ApiTest.vue';
import CheckIn from '@/components/CheckIn.vue';
import Info from '@/components/Info.vue';

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
