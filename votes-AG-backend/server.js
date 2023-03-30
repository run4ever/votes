const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

class Coproprietaire {
  constructor(id, nom, tantiemes, votes) {
    this.id = id;
    this.nom = nom;
    this.tantiemes = tantiemes;
    this.votes = votes;
  }
}

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
  const coproprietaires = JSON.parse(fs.readFileSync(dataFile));
  res.json(coproprietaires);
});

// Mettre à jour le résultat du vote pour un copropriétaire
app.put("/coproprietaires", (req, res) => {
  console.log("update copro -- debut");
  const coproprietaires = JSON.parse(fs.readFileSync(dataFile));
  coproNewValues = new Coproprietaire();
  coproNewValues = req.body;
  const id = coproNewValues.id;
  const votes = coproNewValues.votes;

  // Recherche du copropriétaire avec l'id correspondant
  const coproToUpdate = coproprietaires.find((c) => c.id === id);

  console.log("anciennes valeurs :" + coproToUpdate);

  if (!coproToUpdate) {
    res.status(404).send(`Copropriétaire avec l'id ${id} non trouvé`);
  } else {
    // Mise à jour du vote du copropriétaire
    coproToUpdate.votes = votes;

    console.log("nouvelles valeurs :" + coproNewValues);

    // Enregistrement des modifications dans le fichier JSON
    fs.writeFileSync("data.json", JSON.stringify(coproprietaires, null, 2));
  }
  console.log("update copro -- fin");
});

app.listen(3000, () => {
  console.log("Serveur démarré sur le port 3000");
});
