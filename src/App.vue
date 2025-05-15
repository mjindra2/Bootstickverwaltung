<template>
  <div id="app">
    <!-- Header-Bereich -->
    <div class="header-image" v-if="$route.name !== 'LoginPage'">
      <img src="./assets/just-do-it.png" alt="Header Banner" class="banner-image" />
    </div>

    <!-- Navigation -->
    <nav class="black darken-3" v-if="$route.name !== 'LoginPage'">
      <div class="nav-wrapper">
        <ul id="nav-mobile" class="right">
          <li><img src="./assets/image.png" class="image-logo" /></li>
          <li><router-link to="/Dashboard">Dashboard</router-link></li>
          <li><router-link to="/Reservierung">Reservierung</router-link></li>
          <li><router-link to="/Rückgabe">Rückgabe</router-link></li>
          <!--<li><router-link to="/USB-Stick-Verwaltung">USB-Stick-Verwaltung</router-link></li> -->
        </ul>
        <a class="dropdown-trigger left" href="#" data-target="user-menu">
          A <i class="material-icons right"><img src="./assets/icons8-zurück-50.png" alt="Beispielbild" class="mein-bild" /></i>
        </a>
      </div>
    </nav>

    <!-- Dropdown-Menü -->
    <ul id="user-menu" class="dropdown-content">
      <li>
        <span class="non-clickable1">Sie sind angemeldet als:</span>
        <span class="non-clickable2">Admin</span>
      </li>
      <li class="divider"></li>
      <li><router-link to="/Administration">Administration</router-link></li>
      <!-- <li><router-link to="/MeineDaten">Meine Daten</router-link></li>
      <li><router-link to="/Berichte">Berichte</router-link></li>
      <li><router-link to="/Wartungen">Wartungen</router-link></li>
      <li class="divider"></li>-->
      <li><router-link to="/">Logout</router-link></li>
    </ul>

    <!-- Hauptinhalt -->
    <router-view />

    <!-- Footer -->
    <footer class="footer" v-if="$route.name !== 'LoginPage'">
      <div class="footer-content">
        <p class="footer-text">Projekt Bootstickverwaltung</p>
        <img src="./assets/image.png" class="footer-logo" />
      </div>
    </footer>
  </div>
</template>


<script>
import M from "materialize-css";

export default {
  name: "App",

  beforeMount() {
  if (sessionStorage.getItem("triggerReload")) {
    sessionStorage.removeItem("triggerReload");
    location.reload(); // Seite wird genau 1x neu geladen
  }
},


  mounted() {
    const dropdowns = document.querySelectorAll(".dropdown-trigger");
    M.Dropdown.init(dropdowns, { coverTrigger: false });
  }
};
</script>


<style src="@/assets/stylesApp.css"></style>