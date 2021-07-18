import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/Index.vue";
import BaseHeader from "../components/header/base.vue";
import MAIN from "../components/Main/main.vue";
import { store } from "../store/store";
// import ToolbarHeader from '../components/header/toolbar.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    components: {
      default: Index,
      header: BaseHeader,
    },
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("../views/Signup.vue"),
  },
  {
    path: "/main",
    name: "main",
    components: {
      default: MAIN,
      // 'header' : ToolbarHeader
    },
    meta: { authRequired: true },
  },
  {
    path: "*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(function(to, from, next) {
  if (
    to.matched.some(function(routerInfo) {
      return routerInfo.meta.authRequired;
    })
  ) {
    if (store.getters.getLoginId && store.getters.getLogin_uid) {
      store.dispatch("sc_conn", store.getters.getLoginId);
      next();
    } else {
      alert("fail");
      next(from.path);
    }
  } else {
    next();
  }
});

export default router;
