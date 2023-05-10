import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const router = createRouter({
    //history: createWebHistory(),
    history: createWebHashHistory(),
    // history: process.env.IS_ELECTRON ? createWebHashHistory(process.env.BASE_URL) : createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login',
            component: () => import('@/登录窗口/LoginWindow.vue')
            // component: () => import('../components/FlowArea.vue')
        },

        {
            path: '/main',
            name: 'main',
            component: () => import('@/主窗口/MainWindow.vue'),
            meta: { requireAuth: true }
            // children: [
            //     {
            //         path: '/processDp',
            //         name: 'process',
            //         component: () => import('@/流程图操作/FlowArea.vue')
            //     },
            // ]
        },

        {
            path: '/reg',
            name: 'reg',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ '../cloud/reg.vue'),
           
        },

        {
            path: '/Index',
            name: 'Index',
            component: () => import(/* webpackChunkName: "about" */ '../cloud/Index.vue'),
            meta: { requireAuth: true }
        },
        
        {
            path: '/userManage',
            name: 'userManage',
            component: () => import(/* webpackChunkName: "about" */ '../cloud/userManage.vue'),
            meta: { requireAuth: true }
        },
        

    ]
})


const isAuthenticated = () => {
    return sessionStorage.getItem('userInfo') !== null;
  };
  
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth)) {
      if (!isAuthenticated()) {
        console.log("路由守卫")
        next({
          path: '/',
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    } else {
      next();
    }
  });

export default router

