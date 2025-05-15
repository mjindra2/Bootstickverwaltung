<template>
  <div class="container">
    <h1 class="page-title">Reservierung</h1>
    <form @submit.prevent="submitReservation" class="reservation-form">
      <!-- Dropdown für USB-Stick Typ -->
      <div class="form-group">
        <label for="stickType">USB-Stick Typ</label>
        <select id="stickType" v-model="selectedStickType" class="form-control" required>
          <option value="" disabled>Bitte wählen...</option>
          <option v-for="type in stickTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>

      <!-- Dropdown für Gruppen -->
      <div class="form-group" v-if="selectedStickType">
        <label for="group">Gruppe</label>
        <select id="group" v-model="selectedGroupId" class="form-control" required>
          <option value="" disabled>Bitte wählen...</option>
          <option v-for="group in getReservierbareGruppen(selectedStickType)" :key="group.groupId" :value="group.groupId">
            {{ group.groupId }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="startDate">Startdatum</label>
        <input type="date" id="startDate" v-model="startDate" class="form-control" required />
      </div>

      <div class="form-group">
        <label for="endDate">Rückgabedatum</label>
        <input type="date" id="endDate" v-model="endDate" class="form-control" required />
      </div>

      <button type="submit" class="button">Reservieren</button>
    </form>

    <div v-if="reservationComplete" class="confirmation">
      <h2>Reservierung abgeschlossen</h2>
      <router-link to="/Dashboard">
        <img src="@/assets/checkmark.png" alt="Bestätigung" class="confirmation-icon" />
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ReservierungPage",
  data() {
    return {
      stickGroups: [],
      allSticks: [],
      stickTypes: ["Boot-Stick", "Daten-Stick"],
      selectedStickType: "",
      selectedGroupId: "",
      startDate: "",
      endDate: "",
      reservationComplete: false,
      currentUser: "admin"
    };
  },
  methods: {
    async loadData() {
      try {
        const res = await axios.get("http://localhost:3000/api/data");
        this.stickGroups = res.data.stickGroups || [];
        this.allSticks = res.data.allSticks || [];
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
      }
    },
    async saveData() {
      try {
        await axios.post("http://localhost:3000/api/data", {
          stickGroups: this.stickGroups,
          allSticks: this.allSticks
        });
      } catch (error) {
        console.error("Fehler beim Speichern der Daten:", error);
      }
    },
    getReservierbareGruppen(type) {
      return this.stickGroups.filter(group => {
        return group.stickType === type && group.sticks.some(s => s.availability === "Verfügbar" && s.condition !== "Defekt" && !s.user);
      });
    },
    async submitReservation() {
      const today = new Date().toISOString().split("T")[0];

      if (!this.selectedStickType || !this.selectedGroupId || !this.startDate || !this.endDate) {
        alert("Bitte alle Felder ausfüllen.");
        return;
      }
      if (this.startDate < today) {
        alert("Das Startdatum muss mindestens das heutige Datum oder später sein.");
        return;
      }
      if (this.startDate > this.endDate) {
        alert("Das Startdatum darf nicht nach dem Enddatum liegen.");
        return;
      }

      const group = this.stickGroups.find(g => g.groupId === this.selectedGroupId);
      if (!group) return;

      const availableStick = group.sticks.find(s => s.availability === "Verfügbar" && !s.user && s.condition !== "Defekt");
      if (!availableStick) {
        alert("Keine verfügbaren (nicht defekten) Sticks in dieser Gruppe.");
        return;
      }

      availableStick.availability = "Reserviert";
      availableStick.startDate = this.startDate;
      availableStick.endDate = this.endDate;
      availableStick.user = this.currentUser;

      const allStick = this.allSticks.find(s => s.inventoryNumber === availableStick.inventoryNumber);
      if (allStick) Object.assign(allStick, availableStick);

      this.selectedStickType = "";
      this.selectedGroupId = "";
      this.startDate = "";
      this.endDate = "";
      this.reservationComplete = true;

      await this.saveData();
    }
  },
  async mounted() {
    await this.loadData();
  },
};
</script>

<style src="@/assets/styles.css"></style>
