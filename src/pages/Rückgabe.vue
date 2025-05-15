<template>
  <div class="container">
    <h1 class="page-title">Rückgabe</h1>
    <form @submit.prevent="submitReturn" class="form">
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
        <select id="group" v-model="selectedGroupId" class="form-control" required @change="updateSelectedSticks">
          <option value="" disabled>Bitte wählen...</option>
          <option v-for="group in getRueckgabefaehigeGruppen(selectedStickType)" :key="group.groupId" :value="group.groupId">{{ group.groupId }}</option>
        </select>
      </div>

      <!-- Dropdown für Zustand -->
      <div class="form-group">
        <label for="zustand">Zustand</label>
        <select id="zustand" v-model="selectedCondition" class="form-control" required @change="updateDefectiveSticks">
          <option value="" disabled>Bitte wählen...</option>
          <option v-for="condition in conditions" :key="condition" :value="condition">{{ condition }}</option>
        </select>
      </div>

      <!-- Textarea für Notizen -->
      <div class="form-group" v-if="selectedCondition === 'Defekt'">
        <label for="note">Bemerkung</label>
        <textarea id="note" v-model="note" class="form-control" placeholder="Bitte geben Sie eine Bemerkung ein..." required></textarea>
      </div>

      <!-- Checkbox-Liste für alle Sticks in der Gruppe -->
      <div class="form-group" v-if="selectedGroupId && selectedCondition === 'Defekt'">
        <label>Sticks in dieser Gruppe:</label>
        <div class="stick-list">
          <div v-for="stick in currentGroupSticks" :key="stick.inventoryNumber" class="stick-item">
            <label class="stick-label">
              <input 
                type="checkbox" 
                :value="stick.inventoryNumber" 
                v-model="selectedDefectiveSticks"
                :disabled="stick.condition === 'Defekt'"
                class="stick-checkbox"
              />
              <span class="stick-info">
                #{{ stick.inventoryNumber }} - {{ stick.type }} 
                <span v-if="stick.condition === 'Defekt'" class="defect-badge">(Defekt)</span>
              </span>
            </label>
          </div>
        </div>
      </div>

      <button type="submit" class="button">Zurückgeben</button>
    </form>

    <!-- Bestätigung -->
    <div v-if="returnComplete" class="confirmation">
      <h2>Rückgabe abgeschlossen</h2>
      <router-link to="/Dashboard">
        <img src="@/assets/checkmark.png" alt="Bestätigung" class="confirmation-icon" />
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RückgabePage",
  data() {
    return {
      stickGroups: [],
      allSticks: [],
      stickTypes: ["Boot-Stick", "Daten-Stick"],
      selectedStickType: "",
      selectedGroupId: "",
      selectedCondition: "",
      selectedDefectiveSticks: [],
      currentGroupSticks: [],
      note: "",
      currentUser: "admin",
      returnComplete: false,
      conditions: ["Neu", "Gebraucht", "Defekt"]
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
    getRueckgabefaehigeGruppen(type) {
      return this.stickGroups.filter(group => {
        return group.stickType === type && 
               group.sticks.some(s => s.availability === "Reserviert" && 
                                     s.user === this.currentUser);
      });
    },
    updateSelectedSticks() {
      const group = this.stickGroups.find(g => g.groupId === this.selectedGroupId);
      this.currentGroupSticks = group ? [...group.sticks] : [];
      this.selectedDefectiveSticks = [];
    },
    updateDefectiveSticks() {
      if (this.selectedCondition !== 'Defekt') {
        this.selectedDefectiveSticks = [];
      }
    },
    async submitReturn() {
      if (!this.selectedGroupId || !this.selectedCondition) {
        alert("Bitte alle Felder ausfüllen.");
        return;
      }

      const group = this.stickGroups.find(g => g.groupId === this.selectedGroupId);
      if (!group) return;

      for (const stick of group.sticks) {
        if (stick.user === this.currentUser && stick.availability === "Reserviert") {
          // Only mark as defective if the stick is in selectedDefectiveSticks
          if (this.selectedCondition === "Defekt" && this.selectedDefectiveSticks.includes(stick.inventoryNumber)) {
            stick.condition = "Defekt";
            stick.note = this.note;
          } else if (this.selectedCondition !== "Defekt") {
            // For non-defective condition, update all sticks in the group
            stick.condition = this.selectedCondition;
            stick.note = "";
          }

          // Always update availability for all sticks in the group
          stick.availability = "Verfügbar";
          stick.startDate = "";
          stick.endDate = "";
          stick.user = "";

          // Update global stick
          const globalStick = this.allSticks.find(s => s.inventoryNumber === stick.inventoryNumber);
          if (globalStick) Object.assign(globalStick, stick);
        }
      }

      await this.saveData();
      
      // Reset form
      this.selectedGroupId = "";
      this.selectedStickType = "";
      this.selectedCondition = "";
      this.selectedDefectiveSticks = [];
      this.currentGroupSticks = [];
      this.note = "";
      this.returnComplete = true;
    },
  },
  async mounted() {
    await this.loadData();
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.stick-list {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.stick-item {
  padding: 8px;
  margin: 5px 0;
  border-bottom: 1px solid #eee;
}

.stick-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
}

.stick-checkbox {
  margin-right: 10px;
}

.stick-info {
  flex-grow: 1;
}

.defect-badge {
  color: #ff4444;
  font-size: 0.9em;
}

.button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.confirmation {
  text-align: center;
  margin-top: 30px;
}

.confirmation-icon {
  width: 100px;
  margin-top: 20px;
}
</style>