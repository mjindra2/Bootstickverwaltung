<template>
  <div class="container">
    <h1 class="page-title">Administration</h1>

    <!-- Stick hinzufügen -->
    <section>
      <h3>Stick hinzufügen</h3>
      <div class="form-group">
        <label for="stickType">USB-Stick Typ</label>
        <select id="stickType" v-model="newStick.type" class="form-control" required>
          <option value="" disabled>Bitte wählen...</option>
          <option v-for="type in stickTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="condition">Zustand</label>
        <select id="condition" v-model="newStick.condition" class="form-control" required>
          <option value="" disabled>Bitte wählen...</option>
          <option v-for="condition in conditions" :key="condition" :value="condition">{{ condition }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="storageCapacity">Speicherkapazität</label>
        <input
          id="storageCapacity"
          type="text"
          class="form-control"
          v-model="newStick.storageCapacity"
          placeholder="Speicherkapazität eingeben"
        />
      </div>
      <div class="form-group">
        <label for="serialNumber">Seriennummer</label>
        <input
          id="serialNumber"
          type="text"
          class="form-control"
          v-model="newStick.serialNumber"
          placeholder="Seriennummer eingeben"
        />
      </div>
      <div class="form-group">
        <label for="inventoryNumber">Inventarnummer</label>
        <input
          id="inventoryNumber"
          type="text"
          class="form-control"
          v-model="newStick.inventoryNumber"
          placeholder="Inventarnummer eingeben"
        />
      </div>
      <div class="form-group">
        <label for="manufacturerModel">Hersteller und Modell</label>
        <input
          id="manufacturerModel"
          type="text"
          class="form-control"
          v-model="newStick.manufacturerModel"
          placeholder="Hersteller und Modell eingeben"
        />
      </div>
      <button class="button" @click="addStick">Stick hinzufügen</button>
    </section>

    <!-- Stick-Gruppen verwalten -->
    <section>
      <h3>Stick-Gruppen verwalten</h3>
      <div class="form-group">
        <label for="newGroup">Neue Gruppe erstellen</label>
        <input
          id="newGroup"
          type="text"
          class="form-control"
          v-model="newGroup"
          placeholder="Neue Gruppe eingeben"
        />
      </div>
      <div class="form-group">
        <label for="groupType">Gruppentyp</label>
        <select id="groupType" v-model="newGroupType" class="form-control" required>
          <option value="" disabled>Bitte wählen...</option>
          <option value="boot">Boot-Stick</option>
          <option value="data">Daten-Stick</option>
        </select>
      </div>
      <button class="button" @click="addGroup">Gruppe erstellen</button>
    </section>

    <!-- Bestehende Gruppen -->
    <section>
      <h3>Bestehende Gruppen</h3>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Gruppen</th>
              <th>Typ</th>
              <th>Anzahl der Sticks</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="group in stickGroups" :key="group.groupId">
              <td>{{ group.groupId }}</td>
              <td>{{ group.groupType === 'boot' ? 'Boot-Stick' : 'Daten-Stick' }}</td>
              <td>{{ group.numberOfSticks }}</td>
              <td>
                <button class="button" style="background-color: yellow; color: black;" @click="openEditGroupPopup(group)">Bearbeiten</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Vorhandene Sticks verwalten -->
    <section>
      <h3>Vorhandene Sticks verwalten</h3>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Inventarnummer</th>
              <th>Typ</th>
              <th>Zustand</th>
              <th>Speicherkapazität</th>
              <th>Hersteller und Modell</th>
              <th>Seriennummer</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stick in allSticks" :key="stick.inventoryNumber">
              <td>{{ stick.inventoryNumber }}</td>
              <td>{{ stick.type }}</td>
              <td>{{ stick.condition }}</td>
              <td>{{ stick.storageCapacity }}</td>
              <td>{{ stick.manufacturer }} {{ stick.model }}</td>
              <td>{{ stick.serialNumber }}</td>
              <td>
                <button class="button" style="background-color: yellow; color: black;" @click="openEditStickPopup(stick)">Bearbeiten</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Popup für Gruppenbearbeitung -->
    <div v-if="isEditGroupPopupOpen" class="popup-overlay">
      <div class="popup-content">
        <span class="close-popup" @click="closeEditGroupPopup">&times;</span>
        <h3>Sticks in Gruppe {{ selectedGroup.groupId }}</h3>
        <p><strong>Gruppentyp:</strong> {{ selectedGroup.groupType === 'boot' ? 'Boot-Stick' : 'Daten-Stick' }}</p>
        <ul>
          <li v-for="stick in selectedGroup.sticks" :key="stick.inventoryNumber">
            {{ stick.inventoryNumber }} - {{ stick.type }} ({{ stick.condition }})
            <button @click="removeStickFromGroup(stick.inventoryNumber)">Entfernen</button>
          </li>
        </ul>
        <div>
          <h4>Stick hinzufügen</h4>
          <select v-model="newStickToAdd" class="form-control">
            <option value="" disabled>Bitte wählen...</option>
            <option v-for="stick in availableSticks" :key="stick.inventoryNumber" :value="stick.inventoryNumber">
              {{ stick.inventoryNumber }} - {{ stick.type }}
            </option>
          </select>
          <button class="button" @click="addStickToGroup">Hinzufügen</button>
        </div>
        <button class="button" style="background-color: red; color: white;" @click="deleteGroup(selectedGroup.groupId)">Gruppe löschen</button>
      </div>
    </div>

    <!-- Popup für Stickbearbeitung -->
    <div v-if="isEditStickPopupOpen" class="popup-overlay">
      <div class="popup-content">
        <span class="close-popup" @click="closeEditStickPopup">&times;</span>
        <h3>Stick bearbeiten</h3>
        <div class="form-group">
          <label for="editType">Typ</label>
          <select id="editType" v-model="selectedStick.type" class="form-control" required>
            <option v-for="type in stickTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="editCondition">Zustand</label>
          <select id="editCondition" v-model="selectedStick.condition" class="form-control" required>
            <option v-for="condition in conditions" :key="condition" :value="condition">{{ condition }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="editStorageCapacity">Speicherkapazität</label>
          <input
            id="editStorageCapacity"
            type="text"
            class="form-control"
            v-model="selectedStick.storageCapacity"
          />
        </div>
        <div class="form-group">
          <label for="editSerialNumber">Seriennummer</label>
          <input
            id="editSerialNumber"
            type="text"
            class="form-control"
            v-model="selectedStick.serialNumber"
          />
        </div>
        <div class="form-group">
          <label for="editManufacturerModel">Hersteller und Modell</label>
          <input
            id="editManufacturerModel"
            type="text"
            class="form-control"
            v-model="selectedStick.manufacturerModel"
          />
        </div>
        <button class="button" @click="updateStick">Speichern</button>
        <button class="button" style="background-color: red; color: white;" @click="deleteStick(selectedStick.inventoryNumber)">Stick löschen</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AdministrationPage",
  data() {
    return {
      stickGroups: [],
      allSticks: [],
      stickTypes: ["Boot-Stick", "Daten-Stick"],
      conditions: ["Neu", "Gebraucht", "Defekt"],
      newStick: {
        type: "",
        condition: "",
        storageCapacity: "",
        serialNumber: "",
        inventoryNumber: "",
        manufacturerModel: "",
      },
      newGroup: "",
      newGroupType: "",
      isEditGroupPopupOpen: false,
      isEditStickPopupOpen: false,
      selectedGroup: null,
      selectedStick: null,
      newStickToAdd: "",
    };
  },
  computed: {
    availableSticks() {
      if (!this.selectedGroup) return [];
      return this.allSticks.filter(
        (stick) =>
          stick.type === this.selectedGroup.stickType &&
          !this.selectedGroup.sticks.some(
            (s) => s.inventoryNumber === stick.inventoryNumber
          )
      );
    },
  },
  methods: {
    async loadData() {
      try {
        const response = await axios.get("http://localhost:3000/api/data");
        const data = response.data;
        this.stickGroups = data.stickGroups || [];
        this.allSticks = data.allSticks || [];

        // Fallback sicherstellen
        const typesFromData = new Set(this.allSticks.map((s) => s.type));
        if (typesFromData.size > 0) {
          this.stickTypes = ["Boot-Stick", "Daten-Stick", ...typesFromData];
          this.stickTypes = [...new Set(this.stickTypes)];
        }
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
      }
    },

    async saveData() {
      const data = {
        stickGroups: this.stickGroups,
        allSticks: this.allSticks,
      };
      try {
        await axios.post("http://localhost:3000/api/data", data);
      } catch (error) {
        console.error("Fehler beim Speichern der Daten:", error);
      }
    },

    async addStick() {
      if (
        !this.newStick.type ||
        !this.newStick.condition ||
        !this.newStick.storageCapacity ||
        !this.newStick.serialNumber ||
        !this.newStick.inventoryNumber ||
        !this.newStick.manufacturerModel
      ) {
        alert("Bitte füllen Sie alle Felder aus, um einen Stick hinzuzufügen.");
        return;
      }

      if (this.allSticks.some(stick => stick.inventoryNumber === this.newStick.inventoryNumber)) {
        alert("Ein Stick mit dieser Inventarnummer existiert bereits!");
        return;
      }

      const [manufacturer, model] = this.newStick.manufacturerModel.split(" ");

      this.allSticks.push({
        inventoryNumber: this.newStick.inventoryNumber,
        type: this.newStick.type,
        condition: this.newStick.condition,
        storageCapacity: this.newStick.storageCapacity,
        manufacturer: manufacturer,
        model: model || "",
        serialNumber: this.newStick.serialNumber,
        availability: "Verfügbar",
      });

      this.newStick = {
        type: "",
        condition: "",
        storageCapacity: "",
        serialNumber: "",
        inventoryNumber: "",
        manufacturerModel: "",
      };

      await this.saveData();
      alert("Stick erfolgreich hinzugefügt!");
    },

    async addGroup() {
      if (!this.newGroup || !this.newGroupType) {
        alert("Bitte geben Sie einen Gruppennamen und Typ an.");
        return;
      }

      const exists = this.stickGroups.some((g) => g.groupId === this.newGroup);
      if (exists) {
        alert("Gruppe existiert bereits.");
        return;
      }

      const group = {
        groupId: this.newGroup,
        groupType: this.newGroupType,
        stickType: this.newGroupType === "boot" ? "Boot-Stick" : "Daten-Stick",
        numberOfSticks: 0,
        sticks: [],
      };

      this.stickGroups.push(group);
      this.newGroup = "";
      this.newGroupType = "";
      await this.saveData();
      alert("Gruppe erstellt. Jetzt können Sticks hinzugefügt werden.");
    },

    async deleteGroup(groupId) {
      const groupIndex = this.stickGroups.findIndex(group => group.groupId === groupId);
      if (groupIndex !== -1) {
        this.stickGroups.splice(groupIndex, 1);
        await this.saveData();
        alert("Gruppe erfolgreich gelöscht!");
      }
    },

    async deleteStick(inventoryNumber) {
      for (const group of this.stickGroups) {
        const stickIndex = group.sticks.findIndex(stick => stick.inventoryNumber === inventoryNumber);
        if (stickIndex !== -1) {
          group.sticks.splice(stickIndex, 1);
          group.numberOfSticks--;
        }
      }

      const stickIndex = this.allSticks.findIndex(stick => stick.inventoryNumber === inventoryNumber);
      if (stickIndex !== -1) {
        this.allSticks.splice(stickIndex, 1);
      }

      await this.saveData();
      alert("Stick erfolgreich gelöscht!");
      this.closeEditStickPopup();
    },

    openEditGroupPopup(group) {
      this.selectedGroup = group;
      this.isEditGroupPopupOpen = true;
    },

    closeEditGroupPopup() {
      this.isEditGroupPopupOpen = false;
      this.selectedGroup = null;
      this.newStickToAdd = "";
    },

    async addStickToGroup() {
      if (!this.newStickToAdd || !this.selectedGroup) return;

      const stick = this.allSticks.find(
        (s) => s.inventoryNumber === this.newStickToAdd
      );

      if (!stick) return;

      const alreadyInGroup = this.selectedGroup.sticks.some(
        (s) => s.inventoryNumber === stick.inventoryNumber
      );

      if (alreadyInGroup) {
        alert("Dieser Stick ist bereits in dieser Gruppe enthalten!");
        return;
      }

      if (stick.type !== this.selectedGroup.stickType) {
        alert("Typ passt nicht zur Gruppe.");
        return;
      }

      this.selectedGroup.sticks.push(stick);
      this.selectedGroup.numberOfSticks++;

      await this.saveData();
    },

    async removeStickFromGroup(inventoryNumber) {
      const index = this.selectedGroup.sticks.findIndex(
        (s) => s.inventoryNumber === inventoryNumber
      );
      if (index !== -1) {
        this.selectedGroup.sticks.splice(index, 1);
        this.selectedGroup.numberOfSticks--;
        await this.saveData();
      }
    },

    openEditStickPopup(stick) {
      this.selectedStick = {
        ...stick,
        manufacturerModel: `${stick.manufacturer} ${stick.model}`,
      };
      this.isEditStickPopupOpen = true;
    },

    closeEditStickPopup() {
      this.isEditStickPopupOpen = false;
      this.selectedStick = null;
    },

    async updateStick() {
      const [manufacturer, model] = this.selectedStick.manufacturerModel.split(" ");

      const updatedStick = {
        ...this.selectedStick,
        manufacturer: manufacturer,
        model: model || "",
      };

      const stickIndex = this.allSticks.findIndex(
        (stick) => stick.inventoryNumber === updatedStick.inventoryNumber
      );

      if (stickIndex !== -1) {
        this.allSticks[stickIndex] = updatedStick;

        for (const group of this.stickGroups) {
          const groupStickIndex = group.sticks.findIndex(
            (stick) => stick.inventoryNumber === updatedStick.inventoryNumber
          );
          if (groupStickIndex !== -1) {
            if (group.stickType && updatedStick.type !== group.stickType) {
              group.sticks.splice(groupStickIndex, 1);
              group.numberOfSticks--;
            } else {
              group.sticks[groupStickIndex] = updatedStick;
            }
          }
        }
      }

      await this.saveData();
      this.closeEditStickPopup();
      alert("Stick erfolgreich aktualisiert!");
    },
  },
  async mounted() {
    await this.loadData();
  },
};
</script>



<style src="@/assets/styles.css"></style>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.close-popup {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
}

.popup-content ul {
  list-style-type: none;
  padding: 0;
}

.popup-content ul li {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-content ul li button {
  margin-left: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.button {
  padding: 8px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.button:hover {
  background-color: #45a049;
}

.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  background-color: #f2f2f2;
}

.table tr:hover {
  background-color: #f5f5f5;
}
</style>