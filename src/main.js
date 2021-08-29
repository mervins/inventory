import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import Toast from "vue-toastification";
import VueApexCharts from 'vue-apexcharts';
import "vue-toastification/dist/index.css";
Vue.use(Toast, {
    transition: "Vue-Toastification__fade",
    maxToasts: 20,
    newestOnTop: true,
    filterBeforeCreate: (toast, toasts) => {
        if (toasts.filter(
                t => t.type === toast.type
            ).length !== 0) {
            // Returning false discards the toast
            return false;
        }
        // You can modify the toast if you want
        return toast;
    }
});
Vue.use(axios);
Vue.use(Loading);
Vue.use(VueApexCharts);
Vue.config.productionTip = false

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')