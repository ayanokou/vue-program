
import { createApp } from 'vue'
import App from '@/sys/App.vue'
import router from '../src/sys/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@logicflow/core/dist/style/index.css'
import '@logicflow/extension/lib/style/index.css'
import store from '@/sys/store'


const app=createApp(App)

app.directive('permission', (el, binding,)=> {
    // 获取当前用户的权限列表（从sessionStorage中获取）
    const userPermissions = JSON.parse(sessionStorage.getItem('userInfo')).permissions;

    // 获取指令传入的权限标识
    const requiredPermission = binding.value;

    // 判断用户是否具有该权限
    if (!userPermissions || !userPermissions.includes(requiredPermission)) {
      // 如果用户没有该权限，则从DOM中移除该元素
      el.disabled = true;
      el.classList.add('disabled');
      
    }
    console.log("成功了");
  }
);
// 配置全局变量 页面中使用 inject 接收
app.provide('global',{
  store:"global store"
})
app.config.unwrapInjectedRef = true
app.use(router)
app.use(store)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
app.mount('#App')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
