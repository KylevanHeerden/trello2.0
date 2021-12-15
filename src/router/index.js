import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import { auth } from "../firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Home",
    component: Home,
  },
  {
    path: "/",
    name: "Dashboard",
    props: true,
    component: () =>
      import(/* webpackChankName: "dashboard"*/ "@/views/Dashboard.vue"),
    // meta: {
    //   requiresAuth: true,
    // },
  },
  {
    path: "/programme/:id",
    name: "Programme",
    props: true,
    component: () =>
      import(/* webpackChankName: "product"*/ "@/views/Programme.vue"),
    // meta: {
    //   requiresAuth: true,
    // },
  },
  {
    path: "/programme_board/:id",
    name: "ProgrammeBoard",
    props: true,
    component: () =>
      import(/* webpackChankName: "product"*/ "@/views/Programme_board.vue"),
    // meta: {
    //   requiresAuth: true,
    // },
  },
  {
    path: "/product/:id",
    name: "Product",
    component: () =>
      import(/* webpackChankName: "product" */ "@/views/Product.vue"),
    // meta: {
    //   requiresAuth: true,
    // },
  },
  {
    path: "/teams",
    name: "Teams",
    component: () =>
      import(/* webpackChankName: "teams" */ "@/views/Teams.vue"),
    // meta: {
    //   requiresAuth: true,
    // },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () =>
      import(/* webpackChankName: "profile" */ "@/views/Profile.vue"),
    // meta: {
    //   requiresAuth: true,
    // },
  },
  {
    path: "/admin",
    name: "Admin",
    component: () =>
      import(/* webpackChankName: "profile" */ "@/views/Admin.vue"),
    // meta: {
    //   requiresAuth: true,
    // },
  },
  {
    path: "/finance",
    name: "Finance",
    component: () =>
      import(/* webpackChankName: "profile" */ "@/views/Finance.vue"),
    // meta: {
    //   requiresAuth: true,
    // },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   const requiresAuth = to.matched.some((x) => x.meta.requiresAuth);

//   if (requiresAuth && !auth.currentUser) {
//     next("/login");
//   } else {
//     next();
//   }
// });

router.afterEach((to) => {
  const splitPath = to.path.split("/");

  localStorage.setItem("LS_ROUTE_KEY", splitPath[splitPath.length - 1]);
});

export default router;
