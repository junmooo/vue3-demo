import { createApp } from "vue";
import App from "./App.vue";
// import ElementPlus from "element-plus";
// import "element-plus/dist/index.css";

// import store from "@/utils/socketVuex.js";
import dotenv from "dotenv";
dotenv.config();

// createApp(App).use(ElementPlus).mount("#app");
createApp(App).mount("#app");
