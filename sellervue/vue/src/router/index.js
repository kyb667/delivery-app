import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import BaseHeader from '../components/header/base.vue'
import MAIN from '../components/Main/main.vue'
import { store } from '../store/store'
// import ToolbarHeader from '../components/header/toolbar.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      'default' : Index,
      'header' : BaseHeader
    }
  },
  {
    path: '/signup',
    name: 'signup',
    component:  () => import('../views/Signup.vue')
  },
  {
    path: '/main',
    name: 'main',
    components: {
      'default' : MAIN,
      // 'header' : ToolbarHeader
    },
    // meta:{authRequired:true}
  },
  // {
  //   path: '/b',
  //   name: 'About',
  //   component: () => import('../views/About.vue'),
  //   meta:{authRequired:true}
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//전역가드
router.beforeEach(function (to, from, next){
  if (to.matched.some(function(routerInfo){
    console.log(routerInfo)
    return routerInfo.meta.authRequired;
  })){
    console.log(store.getters.getNum)
    alert('check')
  }else{
    next();
  }
  
})

export default router
