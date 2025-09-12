/*
 * @Description:
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-12 17:07:43
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-12 17:41:36
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Vant from 'vant'
import 'vant/lib/index.css'
import router from './router'

const app = createApp(App)
app.use(Vant)
app.use(router)
app.mount('#app')
