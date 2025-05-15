<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Login</h1>
      <p>Lehrer können sich mit ihrem Username und dem E-Learning Passwort einloggen.</p>
      <form @submit.prevent="handleLogin">
        <input
          type="text"
          v-model="username"
          placeholder="Username"
          class="input-field"
          required
        />
        <input
          type="password"
          v-model="password"
          placeholder="Passwort"
          class="input-field"
          required
        />
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button type="submit" class="login-button">LOG IN</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      username: "", // Benutzername aus dem Input
      password: "", // Passwort aus dem Input
      errorMessage: null, // Fehlermeldung bei falschem Login
    };
  },
  methods: {
    handleLogin() {
  // Platzhalter für echte Verifizierung
  if (this.username === "admin" && this.password === "1007") {
    // Einmaligen Reload triggern und weiterleiten
    sessionStorage.setItem("triggerReload", "true");
    window.location.href = "/Dashboard";
  } else {
    // Fehlermeldung anzeigen
    this.errorMessage = "Ungültiger Benutzername oder Passwort.";
  }
}

  },
};
</script>

<style scoped>
/* Container für die Login-Seite */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Volle Höhe des Viewports */
  background: linear-gradient(to bottom, #87CEEB, #4682B4); /* Farbverlauf */
}

/* Login-Box */
.login-box {
  background-color: white;
  padding: 20px 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 350px;
}

/* Überschrift */
h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

/* Beschreibung */
p {
  color: #555;
  font-size: 14px;
  margin-bottom: 20px;
}

/* Fehlermeldung */
.error-message {
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
}

/* Eingabefelder */
.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

/* Login-Button */
.login-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

.login-button:hover {
  background-color: #0056b3;
}
</style>
