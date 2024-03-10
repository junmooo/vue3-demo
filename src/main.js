import { createApp } from "vue";
import App from "./App.vue";
import VMdPreview from "@kangc/v-md-editor/lib/preview";
import "@kangc/v-md-editor/lib/style/preview.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import Prism from "prismjs";
import "prismjs/components/prism-json";

import dotenv from "dotenv";

// 选择使用主题
VMdPreview.use(vuepressTheme, {
  Prism,
});
dotenv.config();
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(VMdPreview);
app.mount("#app");
