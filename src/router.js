import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "./pages/Login.vue"; // Pfad und Name stimmen überein
//import DashboardPage from "./pages/Dashboard.vue"; // Pfad und Name stimmen überein

const routes = [
  {
    path: "/",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/Dashboard",
    name: "DashboardPage",
    component: () => import("./pages/Dashboard.vue"), // Lazy Loading für die About-Seite
  },
  {
    path: "/Administration",
    name: "AdministrationPage",
    component: () => import("./pages/Administration.vue"), // Lazy Loading für die About-Seite
  },
  {
    path: "/Reservierung",
    name: "ReservierungPage",
    component: () => import("./pages/Reservierung.vue"), // Lazy Loading für die About-Seite
  },
  {
    path: "/Rückgabe",
    name: "RückgabePage",
    component: () => import("./pages/Rückgabe.vue"), // Lazy Loading für die About-Seite
  },
  {
    path: "/USB-Stick-Verwaltung",
    name: "USB-Stick-VerwaltungPage",
    component: () => import("./pages/USB-Stick-Verwaltung.vue"), // Lazy Loading für die About-Seite
  },
  {
    path: "/MeineDaten",
    name: "MeineDatenPage",
    component: () => import("./pages/MeineDaten.vue"), // Lazy Loading für die About-Seite
  },
  {
    path: "/Berichte",
    name: "BerichtePage",
    component: () => import("./pages/Berichte.vue"), // Lazy Loading für die About-Seite
  },
  {
    path: "/Wartungen",
    name: "WartungenPage",
    component: () => import("./pages/Wartungen.vue"), // Lazy Loading für die About-Seite
  }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
