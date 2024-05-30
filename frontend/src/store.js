// src/store.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userLocation: null,
  },
  mutations: {
    setUserLocation(state, location) {
      state.userLocation = location;
    }
  },
  actions: {
    fetchUserLocation({ commit }) {
      navigator.geolocation.getCurrentPosition(position => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        commit('setUserLocation', location);
      });
    }
  },
  getters: {
    userLocation: state => state.userLocation,
  }
});
