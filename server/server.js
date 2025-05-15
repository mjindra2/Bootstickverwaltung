const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "..", "src", "data", "Test.json");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route zum Abrufen der Daten
app.get("/api/data", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Fehler beim Lesen der Datei:", err);
      return res.status(500).send("Fehler beim Lesen der Daten.");
    }
    res.json(JSON.parse(data));
  });
});

// Route zum Aktualisieren der Daten
app.post("/api/data", (req, res) => {
  const newData = req.body;
  fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), "utf8", (err) => {
    if (err) {
      console.error("Fehler beim Schreiben der Datei:", err);
      return res.status(500).send("Fehler beim Speichern der Daten.");
    }
    res.send("Daten erfolgreich gespeichert.");
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});