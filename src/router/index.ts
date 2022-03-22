import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/types';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: RouteNames.NAVIGATION,
    component: () => import(/* webpackChunkName: "root" */ '../views/Navigation.vue'),
    children: [
      {
        path: '/login',
        name: RouteNames.LOGIN,
        component: () => import(/* webpackChunkName: "auth" */ '../views/Auth.vue'),
        props: {
          hasAccount: true
        }
      },
      {
        path: '/register',
        name: RouteNames.REGISTER,
        component: () => import(/* webpackChunkName: "auth" */ '../views/Auth.vue'),
        props: {
          hasAccount: false
        }
      },
      {
        path: '/suppliers/',
        name: RouteNames.SUPPLIERS,
        component: () => import(/* webpackChunkName: "suppliers" */ '../views/suppliers/Suppliers.vue'),
        children: [
          {
            path: ':id?',
            name: RouteNames.SUPPLIER,
            component: () => import(/* webpackChunkName: "supplier" */ '../views/suppliers/Supplier.vue'),
          }
        ]
      },
      {
        path: '/quotes',
        name: RouteNames.QUOTES,
        component: () => import(/* webpackChunkName: "quotes" */ '../views/Quotes.vue'),
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

import { provideRouter } from '@/utils';

provideRouter(router);

export default router
