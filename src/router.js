import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import PageNotFoundPage from './pages/PageNotFoundPage.vue';

const Index = () =>
  import('./pages/Index.vue');
const Config = () =>
  import('./pages/Config.vue');
const Friends = () =>
  import('./pages/Friends.vue');
const Register = () =>
  import('./pages/Register.vue');
const Login = () =>
  import('./pages/Login.vue');

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/config',
    component: Config,
  },
  {
    path: '/friends',
    component: Friends,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '*',
    component: PageNotFoundPage,
  }
  ]
})
