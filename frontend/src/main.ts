import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createYmaps } from 'vue-yandex-maps';
import { createPinia } from 'pinia';
import '@/assets/css/global/main.scss';
import Notifications from '@kyvg/vue3-notification';

const pinia = createPinia();
const app = createApp(App);

// app.use(
//    createYmaps({
//       apikey: '48e46a75-fc7c-4ef5-80a7-fcb51706331b',
//    }),
// )
app.use(
   createYmaps({
      apikey: '3c973482-c71c-42d1-aa81-99863e90e25c',
   }),
);
app.use(pinia).use(router).use(Notifications);

app.mount('#app');
