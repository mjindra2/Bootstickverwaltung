<template>
  <div class="container">
    <h1 class="page-title" v-if="!ausgewählteGruppe">Dashboard</h1>
    <h1 class="page-title" v-if="ausgewählteGruppe">USB-Sticks {{ ausgewählteGruppe.groupId }}</h1>

    <!-- Tabelle für Gruppenauswahl -->
    <table v-if="!ausgewählteGruppe" class="table">
      <thead>
        <tr>
          <th>Gruppen</th>
          <th>Typ</th>
          <th>Verfügbarkeit</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="gruppe in gruppen"
          :key="gruppe.groupId"
          @click="zeigeGruppeDetails(gruppe)"
          style="cursor: pointer;"
        >
          <td>{{ gruppe.groupId }}</td>
          <td>{{ gruppe.stickType }}</td>
          <td>{{ gruppe.availability }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Tabelle für Stickdetails -->
    <div v-if="ausgewählteGruppe">
      <table class="table">
        <thead>
          <tr>
            <th>Inventarnummer</th>
            <th>Typ</th>
            <th>Verfügbarkeit</th>
            <th>Zustand</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stick in ausgewählteGruppe.sticks" :key="stick.inventoryNumber">
            <td>{{ stick.inventoryNumber }}</td>
            <td>{{ stick.type }}</td>
            <td>{{ stick.availability }}</td>
            <td>{{ stick.condition }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="zurückZurÜbersicht" class="button">← zurück</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";



export default {
  name: "DashboardPage",
  data() {
    return {
      gruppen: [],
      ausgewählteGruppe: null,
    };
  },
  created() {
    this.ladeGruppenDaten();
  },
  methods: {
    async ladeGruppenDaten() {
      try {
        const response = await axios.get("http://localhost:3000/api/data");
        const daten = response.data;

        daten.stickGroups.forEach((group) => {
          group.availability = group.sticks.every(
            (stick) => stick.availability === "Verfügbar"
          )
            ? "Verfügbar"
            : "Reserviert";
        });

        this.gruppen = daten.stickGroups;
      } catch (error) {
        console.error("Fehler beim Laden der Gruppen-Daten:", error);
        alert("Fehler beim Laden der Daten. Bitte überprüfen Sie die Konsole.");
      }
    },
    zeigeGruppeDetails(gruppe) {
      this.ausgewählteGruppe = gruppe;
    },
    zurückZurÜbersicht() {
      this.ausgewählteGruppe = null;
    },
  },
  
};
</script>

<style src="@/assets/styles.css"></style>

<style scoped>
.container {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.table th {
  background-color: #f4f4f4;
  text-align: left;
}

.button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}
</style>