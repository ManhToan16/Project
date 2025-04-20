import { createWebHistory, createRouter } from "vue-router";
import Home from "./components/Home.vue";
import SignUp from "./components/SignUp.vue";
import SignIn from "./components/SignIn.vue";
import SearchResult from "./components/SearchResult.vue";
import Profile from "./components/Profile.vue";
import CreateHost from "./components/CreateHost.vue";
import Posts from "./components/Posts.vue";
import Detail from "./components/Detail.vue";
import About from "./components/About.vue";
import Contact from "./components/Contact.vue";
import UpdateRoom from "./components/UpdateRoom.vue";
import Dashboard from "./components/Dashboard.vue";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    name: "Home",
    component: Home,
    path: "/home",
  },
  {
    name: "SignUp",
    component: SignUp,
    path: "/sign-up",
  },
  {
    name: "SignIn",
    component: SignIn,
    path: "/sign-in",
  },
  {
    name: "SearchResult",
    component: SearchResult,
    path: "/search",
    props: (route) => ({
      searchQuery: route.state?.searchQuery || "",
    }),
  },
  {
    name: "Profile",
    component: Profile,
    path: "/profile",
  },
  {
    name: "CreateHost",
    component: CreateHost,
    path: "/create-host",
  },
  {
    name: "Posts",
    component: Posts,
    path: "/create-post",
  },
  {
    name: "Detail",
    component: Detail,
    path: "/detail/:id",
  },
  {
    name: "UpdateRoom",
    component: UpdateRoom,
    path: "/update/:id",
  },
  {
    name: "About",
    component: About,
    path: "/about",
  },
  {
    name: "Contact",
    component: Contact,
    path: "/contact",
  },
  {
    name: "Dashboard",
    component: Dashboard,
    path: "/dashboard",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
