import Vue from 'vue';
import App from './App.vue';

// Config

// Plugins
import DefaultRouter from '@/plugins/vue-router';
import Vuex from '@/plugins/vuex';

// Modules
import { IRootState } from './interfaces/IRootState';
import AppModule, { IAppModule } from './modules/App.module';

// Services

// Styling
Vue.config.productionTip = false;

const appModule: IAppModule = new AppModule();

const store = new Vuex.Store<IRootState>({
  modules: {
    app: appModule
  }
});

const router = new DefaultRouter([
  { name: 'home' }
], true);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
