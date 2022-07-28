import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
// 必须要引入这个css文件，否则element-plus的标签写样式失效，还会导致
// 写在其后面的非element-plus的标签样式失效
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app =createApp(App)
// element icon 注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

app.use(store).use(router).use(ElementPlus).mount('#app')
