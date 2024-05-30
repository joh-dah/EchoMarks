// src/router.js
import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/MapComponent.vue';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', component: Home },
  ],
});
