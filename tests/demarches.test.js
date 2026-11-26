// Lancer avec : node --test tests/*.test.js
const test = require("node:test");
const assert = require("node:assert/strict");
const { DEMARCHES, selectionner, grouper, valider, echeance } = require("../src/demarches.js");
const CAS = require("../src/cas-de-test.js");

const base = {
  lieuDeces: "france", couple: "seul", enfantsMineurs: false, activite: "autre", logement: "autre",
};
const ids = (s) => selectionner(s).map((d) => d.id);

for (const cas of CAS) {
  test(`cas de test : ${cas.nom}`, () => {
    assert.deepEqual(ids(cas.situation), cas.attendu);
  });
}

test("situation minimale : seules les démarches « toujours » (+ mairie)", () => {
  assert.deepEqual(ids(base), ["acte-deces", "banques", "cpam", "mutuelle", "impots", "comptes-en-ligne"]);
});

test("décès à l'étranger : consulat à la place de la mairie", () => {
  const l = ids({ ...base, lieuDeces: "etranger" });
  assert.ok(l.includes("consulat"));
  assert.ok(!l.includes("acte-deces"));
});

test("chaque activité déclenche le bon organisme", () => {
  assert.ok(ids({ ...base, activite: "salarie" }).includes("employeur"));
  assert.ok(ids({ ...base, activite: "fonctionnaire" }).includes("administration"));
  assert.ok(ids({ ...base, activite: "demandeur" }).includes("france-travail"));
  assert.ok(ids({ ...base, activite: "independant" }).includes("urssaf"));
  assert.ok(ids({ ...base, activite: "retraite" }).includes("caisses-retraite"));
});

test("couple : réversion et livret pour le mariage seulement, impôts du foyer pour mariage et PACS", () => {
  for (const [couple, rev, conj] of [["marie", true, true], ["pacse", false, true], ["concubinage", false, false], ["seul", false, false]]) {
    const l = ids({ ...base, couple });
    assert.equal(l.includes("reversion"), rev, couple);
    assert.equal(l.includes("livret-famille"), rev, couple);
    assert.equal(l.includes("declaration-conjoint"), conj, couple);
  }
});

test("notaire : obligatoire si propriétaire, aussi si testament ou donation", () => {
  assert.ok(ids({ ...base, logement: "proprietaire" }).includes("notaire"));
  assert.ok(ids({ ...base, testament: true }).includes("notaire"));
  assert.ok(!ids(base).includes("notaire"));
  const d = selectionner({ ...base, logement: "proprietaire" }).find((x) => x.id === "notaire");
  assert.match(d.detail, /Obligatoire/);
});

test("CAF : une seule démarche pour enfants mineurs et aides, avec le bon texte", () => {
  const d = selectionner({ ...base, enfantsMineurs: true, aides: ["apl", "aah"] }).filter((x) => x.id === "caf");
  assert.equal(d.length, 1);
  assert.match(d[0].detail, /enfants mineurs/);
  assert.match(d[0].detail, /APL et AAH/);
});

test("la liste est triée par délai, sans retour en arrière", () => {
  const { DELAIS } = require("../src/demarches.js");
  for (const cas of CAS) {
    const rangs = selectionner(cas.situation).map((d) => DELAIS[d.delai].rang);
    assert.deepEqual(rangs, [...rangs].sort((a, b) => a - b));
  }
});

test("regroupement par délai, avec date limite calculée", () => {
  const g = grouper(selectionner(CAS[0].situation), "2026-11-24");
  assert.equal(g[0].libelle, "Dans les 24 heures");
  assert.match(g[0].echeanceTexte, /25 novembre 2026/);
  const sixMois = g.find((x) => x.delai === "6m");
  assert.match(sixMois.echeanceTexte, /24 mai 2027/);
  assert.equal(g.find((x) => x.delai === "vite").echeanceTexte, "");
});

test("échéances : jours, mois, et absence de date", () => {
  assert.equal(echeance("2026-11-24", { jours: 30 }).toISOString().slice(0, 10), "2026-12-24");
  assert.equal(echeance("2026-11-24", { mois: 3 }).toISOString().slice(0, 10), "2027-02-24");
  assert.equal(echeance("", { jours: 30 }), null);
});

test("validation : les 5 questions obligatoires sont signalées", () => {
  assert.equal(valider({}).length, 5);
  assert.equal(valider(base).length, 0);
});

test("chaque démarche a un identifiant unique et un délai connu", () => {
  const { DELAIS } = require("../src/demarches.js");
  const vus = new Set();
  for (const d of DEMARCHES) {
    assert.ok(!vus.has(d.id), d.id); vus.add(d.id);
    assert.ok(DELAIS[d.delai], d.id);
  }
});

test("remplissage de test : 200 situations aléatoires toujours valides et cohérentes", () => {
  const { situationAleatoire } = require("../src/demarches.js");
  for (let i = 0; i < 200; i++) {
    const s = situationAleatoire();
    assert.deepEqual(valider(s), [], JSON.stringify(s));
    const l = ids(s);
    for (const toujours of ["banques", "cpam", "mutuelle", "impots", "comptes-en-ligne"]) assert.ok(l.includes(toujours));
    assert.ok(l.includes(s.lieuDeces === "france" ? "acte-deces" : "consulat"));
    assert.match(s.dateDeces, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test("échéances en fin de mois : pas de débordement sur le mois suivant", () => {
  assert.equal(echeance("2026-08-31", { mois: 6 }).toISOString().slice(0, 10), "2027-02-28");
  assert.equal(echeance("2026-08-31", { mois: 3 }).toISOString().slice(0, 10), "2026-11-30");
  assert.equal(echeance("2027-08-31", { mois: 6 }).toISOString().slice(0, 10), "2028-02-29");
  assert.equal(echeance("2026-12-31", { mois: 3 }).toISOString().slice(0, 10), "2027-03-31");
});

test("traductions : chaque démarche et chaque délai existent en arabe, turc et portugais", () => {
  const { DELAIS } = require("../src/demarches.js");
  const T = require("../src/traductions.js");
  for (const lang of Object.keys(T.LANGUES)) {
    for (const d of DEMARCHES) {
      const t = T.DEMARCHES[d.id] && T.DEMARCHES[d.id][lang];
      assert.ok(t && t[0] && t[1], `${d.id} en ${lang}`);
    }
    for (const k of Object.keys(DELAIS)) assert.ok(T.DELAIS[k][lang], `délai ${k} en ${lang}`);
    for (const k of ["titre", "remis", "avant", "intro", "contact", "note"]) assert.ok(T.DOCUMENT[lang][k], `${k} en ${lang}`);
  }
});

test("traductions du formulaire : chaque entrée existe dans les 3 langues", () => {
  const T = require("../src/traductions.js");
  for (const [cle, t] of Object.entries(T.FORMULAIRE)) for (const lang of Object.keys(T.LANGUES)) assert.ok(t[lang], `${cle} en ${lang}`);
});
