import { createRouter, createWebHashHistory } from 'vue-router'
import LayOut from '../views/layout/layout'
import store from '../store/index'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/pages/login'),
  },
  {
    path: '/',
    name: 'layout',
    component: LayOut,
    // redirect：加载layout页面时重定向到/index
    redirect: '/index',
    // 子路由/嵌套路由
    children:[
      {
        path: '/index',
        name: 'index',
        component: () => import(/* webpackChunkName: "index" */ '../views/pages/index')
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: "role" */ '../views/pages/rolesList')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: "user" */ '../views/pages/usersList')
      },
      {
        path: '/good',
        name: 'good',
        component: () => import(/* webpackChunkName: "gppd" */ '../views/pages/goodList')
      },
        ]
  },
   
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫，路由发生跳转就会监测到
router.beforeEach((from,to,next)=>{
  /*
    第一个参数：from: 从哪个页面
    第二个参数：to: 到哪个页面
    第三个参数：next: 只有执行next()，页面才会进行跳转
  */
  // 判断用户是否登录
  console.log('store', store.state.uInfo);
  const uInfo = store.state.uInfo.userInfo;
  if(!uInfo.username){
    // 用户名不存在，未登录
    if(from.path !== '/login'){
      next('/login')
    }
    
  }else{
    console.log('已登录')
  }
  next();
})

export default router
