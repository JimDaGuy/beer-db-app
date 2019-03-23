import Vue from "vue";
import KeenUI from "keen-ui";
import axios from "axios";
import App from "./App.vue";
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default-dark.css";
import "keen-ui/dist/keen-ui.css";

Vue.prototype.$http = axios;
Vue.use(VueMaterial);
Vue.use(KeenUI);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
