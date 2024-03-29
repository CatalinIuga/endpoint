import { createPinia } from "pinia";
import { createApp } from "vue";
import VueCodemirror from "vue-codemirror";
import App from "./App.vue";
import "./styles.css";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(VueCodemirror, {
  extensions: [],
});

app.mount("#app");
