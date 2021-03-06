import Vue from "vue";
import Router from "vue-router";

import Layout from "../pages/layout/Layout.vue";

Vue.use(Router);

export const constantRoutes = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    name: "Home",
    meta: { title: "Home ", icon: "example" },
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("@/pages/Home.vue"),
        meta: { title: "Home", icon: "table" }
      },
      {
        path: "/about",
        component: () => import("@/pages/About.vue"),
        meta: { title: "Tree", icon: "tree" }
      },
      {
        path: "/formdemo",
        component: () => import("@/pages/demo/FormDemo.vue"),
        meta: { title: "Form Demo", icon: "user" }
      },
      {
        path: "/invitation",
        component: () => import("@/pages/invitation/Invitation.vue"),
        meta: { title: "邀请成员", icon: "user" }
      },
      {
        path: "/tableDemo",
        component: () => import("@/pages/demo/TableDemo.vue"),
        meta: { title: "邀请列表", icon: "user" }
      },
      {
        path: "/usersetting",
        component: () => import("@/pages/demo/UserSettingDemo.vue"),
        meta: { title: "个人设置", icon: "user" }
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/pages/login/Login.vue"),
    hidden: true
  }
];
export const asyncRoutes = [];
const createRouter = () =>
  new Router({
    // mode: "history",
    base: process.env.BASE_URL,
    routes: constantRoutes,
    scrollBehavior() {
      return { x: 0, y: 0 };
    }
  });

const router = createRouter();
router.resetRouter = () => {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
};

export default router;
