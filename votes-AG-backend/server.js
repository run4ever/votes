const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.use(bodyParser.json());

const dataFile = "data.json";

// Récupérer tous les copropriétaires
app.get("/coproprietaires", (req, res) => {
  // Lire les données depuis le fichier JSON
  const data = JSON.parse(fs.readFileSync(dataFile));
  res.json(data);
});

// Mettre à jour le résultat du vote pour un copropriétaire
app.put("/coproprietaires/:nom", (req, res) => {
  // Lire les données depuis le fichier JSON
  const data = JSON.parse(fs.readFileSync(dataFile));

  // Rechercher le copropriétaire par son nom
  const coproprietaire = data.find((c) => c.nom === req.params.nom);

  // Mettre à jour le résultat du vote
  coproprietaire.vote = req.body.vote;

  // Enregistrer les données mises à jour dans le fichier JSON
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

  res.send("Résultat du vote mis à jour avec succès");
});

app.listen(3000, () => {
  console.log("Serveur démarré sur le port 3000");
});
