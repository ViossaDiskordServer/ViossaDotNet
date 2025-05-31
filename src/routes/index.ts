import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import HomePage from '@/components/pages/HomePage.vue'
import ResourcesPage from '@/components/pages/ResourcesPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/resources',
    name: 'Resources',
    component: ResourcesPage,
  },
  // {
  //   path: '/:pathMatch(.*)*',  // Vue Router 4 catch-all for 404s
  //   name: 'NotFound',
  //   component: NotFoundPage,
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router