/*
 * Guide des démarches — Pompes funèbres Delmas
 * Données + moteur de règles (aucune IA générative, aucun appel réseau).
 * Fonctionne dans le navigateur (variable globale GuideDemarches) et sous Node (module.exports).
 *
 * Situation attendue :
 * {
 *   lieuDeces: "france" | "etranger",
 *   couple: "marie" | "pacse" | "concubinage" | "seul",
 *   enfantsMineurs: boolean,
 *   activite: "salarie" | "retraite" | "demandeur" | "fonctionnaire" | "independant" | "autre",
 *   aides: Array<"apl" | "rsa" | "aah" | "invalidite">,
 *   logement: "proprietaire" | "locataire" | "autre",
 *   contrats: boolean, vehicule: boolean, credits: boolean, testament: boolean,
 *   assurances: Array<"vie" | "obseques" | "deces">,
 *   dateDeces: "AAAA-MM-JJ" (facultatif)
 * }
 */
(function (global) {
  "use strict";

  // Groupes de délais, dans l'ordre où ils apparaissent sur le document.
  const DELAIS = {
    "24h":        { rang: 1,   libelle: "Dans les 24 heures", jours: 1 },
    "48h":        { rang: 2,   libelle: "Dans les 48 heures", jours: 2 },
    vite:         { rang: 3,   libelle: "Dès que possible" },
    "30j":        { rang: 4,   libelle: "Dans les 30 jours", jours: 30 },
    "3m":         { rang: 5,   libelle: "Dans les 3 mois", mois: 3 },
    "6m":         { rang: 6,   libelle: "Dans les 6 mois", mois: 6 },
    declaration:  { rang: 7,   libelle: "Lors de la prochaine déclaration de revenus" },
    libre:        { rang: 8,   libelle: "Sans délai imposé" },
    besoin:       { rang: 9,   libelle: "Seulement si nécessaire" },
  };

  const LIBELLES_AIDES = { apl: "APL", rsa: "RSA", aah: "AAH", invalidite: "pension d'invalidité" };
  const LIBELLES_ASSURANCES = { vie: "assurance-vie", obseques: "contrat obsèques", deces: "assurance décès" };

  const liste = (arr) => arr.length <= 1 ? arr.join("") : arr.slice(0, -1).join(", ") + " et " + arr.at(-1);
  const aidesCaf = (s) => (s.aides || []).filter((a) => ["apl", "rsa", "aah"].includes(a));

  // Le guide interne, sous forme de règles. Chaque texte est rédigé et validé à l'avance.
  // L'ordre de ce tableau est l'ordre d'affichage à l'intérieur d'un même délai.
  const DEMARCHES = [
    // — Lieu du décès
    { id: "acte-deces", delai: "24h", critere: "Lieu du décès",
      titre: "Déclarer le décès et obtenir l'acte de décès", organisme: "Mairie du lieu du décès",
      si: (s) => s.lieuDeces === "france",
      detail: "Demandez plusieurs copies de l'acte de décès : elles vous seront demandées pour la plupart des démarches." },
    { id: "consulat", delai: "vite", critere: "Lieu du décès",
      titre: "Faire transcrire le décès à l'état civil français", organisme: "Consulat de France",
      si: (s) => s.lieuDeces === "etranger",
      detail: "Après la déclaration aux autorités du pays, le consulat transcrit l'acte de décès. Demandez-en plusieurs copies." },

    // — Activité
    { id: "employeur", delai: "48h", critere: "Activité",
      titre: "Prévenir l'employeur", organisme: "Employeur",
      si: (s) => s.activite === "salarie",
      detail: "Un appel ou un courrier suffit, avec une copie de l'acte de décès." },
    { id: "administration", delai: "48h", critere: "Activité",
      titre: "Prévenir l'administration employeur", organisme: "Administration",
      si: (s) => s.activite === "fonctionnaire",
      detail: "Un appel ou un courrier au service des ressources humaines, avec une copie de l'acte de décès." },
    { id: "france-travail", delai: "vite", critere: "Activité",
      titre: "Informer France Travail", organisme: "France Travail",
      si: (s) => s.activite === "demandeur",
      detail: "Pour mettre fin à l'inscription et au versement des allocations." },
    { id: "urssaf", delai: "vite", critere: "Activité",
      titre: "Informer l'URSSAF", organisme: "URSSAF",
      si: (s) => s.activite === "independant",
      detail: "Pour déclarer la fin de l'activité indépendante." },

    // — Toujours
    { id: "banques", delai: "vite", critere: "Toujours",
      titre: "Informer les banques", organisme: "Banques",
      si: () => true,
      detail: "Prévenez chaque banque où la personne avait un compte, avec une copie de l'acte de décès." },
    { id: "cpam", delai: "vite", critere: "Toujours",
      titre: "Informer l'Assurance maladie", organisme: "CPAM",
      si: () => true,
      detail: "Selon la situation, un capital décès peut être versé aux proches." },

    // — Enfants mineurs et aides perçues
    { id: "caf", delai: "vite", critere: "Enfants mineurs · Aides perçues",
      titre: "Informer la CAF ou la MSA", organisme: "CAF ou MSA",
      si: (s) => s.enfantsMineurs === true || aidesCaf(s).length > 0,
      detail: (s) => {
        const parts = [];
        if (s.enfantsMineurs) parts.push("pour les enfants mineurs à charge, des aides peuvent être revues");
        const a = aidesCaf(s).map((x) => LIBELLES_AIDES[x]);
        if (a.length) parts.push(`pour les aides versées à la personne (${liste(a)})`);
        return "À prévenir " + parts.join(", et ") + ".";
      } },
    { id: "invalidite", delai: "vite", critere: "Aides perçues",
      titre: "Informer l'organisme qui verse la pension d'invalidité", organisme: "Organisme payeur",
      si: (s) => (s.aides || []).includes("invalidite"),
      detail: "Pour mettre fin au versement de la pension." },

    // — Assurances, crédits
    { id: "assurances", delai: "vite", critere: "Assurances",
      titre: "Prévenir les assureurs", organisme: "Compagnies d'assurance",
      si: (s) => (s.assurances || []).length > 0,
      detail: (s) => {
        const a = s.assurances.map((x) => LIBELLES_ASSURANCES[x]);
        let t = `Contrats concernés : ${liste(a)}. Les bénéficiaires sont à identifier.`;
        if (s.assurances.includes("vie")) t += " En cas de doute sur un contrat d'assurance-vie, une recherche est possible auprès de l'AGIRA.";
        return t;
      } },
    { id: "assurance-emprunteur", delai: "vite", critere: "Banques et crédits",
      titre: "Prévenir l'assurance emprunteur", organisme: "Banque ou assureur du crédit",
      si: (s) => s.credits === true,
      detail: "Pour les crédits en cours : l'assurance peut prendre en charge tout ou partie du capital restant." },

    // — Logement
    { id: "bailleur", delai: "vite", critere: "Logement",
      titre: "Prévenir le bailleur et résilier le bail", organisme: "Bailleur",
      si: (s) => s.logement === "locataire",
      detail: "Par courrier, avec une copie de l'acte de décès." },
    { id: "assurance-habitation", delai: "vite", critere: "Logement",
      titre: "Prévenir l'assurance habitation", organisme: "Assureur habitation",
      si: (s) => s.logement === "proprietaire",
      detail: "Pour transférer ou résilier le contrat." },

    // — Contrats, véhicule
    { id: "contrats", delai: "vite", critere: "Contrats",
      titre: "Résilier ou transférer les contrats", organisme: "Fournisseurs",
      si: (s) => s.contrats === true,
      detail: "Énergie, eau, téléphone, internet et abonnements au nom de la personne." },
    { id: "assurance-auto", delai: "vite", critere: "Véhicule",
      titre: "Prévenir l'assurance auto", organisme: "Assureur auto",
      si: (s) => s.vehicule === true,
      detail: "Pour transférer ou résilier le contrat." },

    // — 30 jours
    { id: "caisses-retraite", delai: "30j", critere: "Activité",
      titre: "Informer les caisses de retraite", organisme: "Caisses de base et complémentaire",
      si: (s) => s.activite === "retraite",
      detail: "Prévenez chaque caisse qui versait une pension, de base et complémentaire." },
    { id: "mutuelle", delai: "30j", critere: "Toujours",
      titre: "Informer la mutuelle", organisme: "Mutuelle",
      si: () => true,
      detail: "Avec une copie de l'acte de décès." },

    // — 3 mois, 6 mois
    { id: "carte-grise", delai: "3m", critere: "Véhicule",
      titre: "Mettre à jour la carte grise", organisme: "ANTS",
      si: (s) => s.vehicule === true,
      detail: "La carte grise doit être mise au nom d'un héritier, ou le véhicule cédé." },
    { id: "notaire", delai: "6m", critere: "Logement · Testament",
      titre: "Prendre contact avec un notaire", organisme: "Notaire",
      si: (s) => s.logement === "proprietaire" || s.testament === true,
      detail: (s) => s.logement === "proprietaire"
        ? "Obligatoire, car la personne possédait un bien immobilier. Le notaire vous accompagnera pour la succession."
        : "Recommandé pour le testament, la donation ou les biens de la personne." },

    // — Impôts
    { id: "impots", delai: "declaration", critere: "Toujours",
      titre: "Faire la dernière déclaration de revenus de la personne", organisme: "Impôts",
      si: () => true,
      detail: "Elle porte sur les revenus perçus jusqu'à la date du décès." },
    { id: "declaration-conjoint", delai: "declaration", critere: "Situation de couple",
      titre: "Adapter la déclaration du foyer", organisme: "Impôts",
      si: (s) => s.couple === "marie" || s.couple === "pacse",
      detail: "L'année du décès, la déclaration du conjoint ou du partenaire de PACS suit des règles particulières : le centre des finances publiques peut vous accompagner." },

    // — Sans délai imposé
    { id: "reversion", delai: "libre", critere: "Situation de couple",
      titre: "Demander la pension de réversion", organisme: "Caisses de retraite de la personne",
      si: (s) => s.couple === "marie",
      detail: "Elle est réservée au conjoint marié. Mieux vaut en faire la demande rapidement." },
    { id: "livret-famille", delai: "libre", critere: "Situation de couple",
      titre: "Mettre à jour le livret de famille", organisme: "Mairie",
      si: (s) => s.couple === "marie",
      detail: "La mention du décès y est ajoutée." },
    { id: "comptes-en-ligne", delai: "libre", critere: "Toujours",
      titre: "Fermer ou transmettre les comptes en ligne", organisme: "Sites et réseaux sociaux",
      si: () => true,
      detail: "Messagerie, réseaux sociaux et comptes en ligne de la personne." },

    // — Si nécessaire
    { id: "juge-tutelles", delai: "besoin", critere: "Enfants mineurs",
      titre: "Vérifier si le juge des tutelles doit intervenir", organisme: "Juge des tutelles",
      si: (s) => s.enfantsMineurs === true,
      detail: "Uniquement dans certains cas, lorsqu'un enfant mineur hérite : le notaire ou votre conseiller vous le dira." },
  ];

  /** Ajoute des jours ou des mois à une date ISO (AAAA-MM-JJ). Renvoie une Date ou null. */
  function echeance(dateDecesIso, delai) {
    if (!dateDecesIso || !delai || (!delai.jours && !delai.mois)) return null;
    const [a, m, j] = dateDecesIso.split("-").map(Number);
    if (!a || !m || !j) return null;
    const d = new Date(Date.UTC(a, m - 1, j));
    if (delai.jours) d.setUTCDate(d.getUTCDate() + delai.jours);
    if (delai.mois) {
      // Pas de débordement : le 31 août + 6 mois donne le 28 février, pas le 3 mars.
      const cible = d.getUTCMonth() + delai.mois;
      const dernierJour = new Date(Date.UTC(d.getUTCFullYear(), cible + 1, 0)).getUTCDate();
      d.setUTCDate(Math.min(d.getUTCDate(), dernierJour));
      d.setUTCMonth(cible);
    }
    return d;
  }

  function formatDate(d) {
    if (!d) return "";
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  }

  /** Les questions obligatoires (choix unique). Les cases à cocher valent « non » si elles sont vides. */
  const OBLIGATOIRES = {
    lieuDeces: ["france", "etranger"],
    couple: ["marie", "pacse", "concubinage", "seul"],
    activite: ["salarie", "retraite", "demandeur", "fonctionnaire", "independant", "autre"],
    logement: ["proprietaire", "locataire", "autre"],
  };
  const NOMS = { lieuDeces: "le lieu du décès", couple: "la situation de couple", activite: "l'activité", logement: "le logement", enfantsMineurs: "les enfants mineurs" };

  function valider(s) {
    const manque = Object.keys(OBLIGATOIRES).filter((k) => !OBLIGATOIRES[k].includes(s[k]));
    if (typeof s.enfantsMineurs !== "boolean") manque.push("enfantsMineurs");
    return manque.map((k) => NOMS[k]);
  }

  /** Normalise une situation partielle (cases non cochées = non). */
  function normaliser(s) {
    return { aides: [], assurances: [], contrats: false, vehicule: false, credits: false, testament: false, ...s };
  }

  /** Cœur du prototype : démarches applicables, triées par délai puis par ordre du guide. */
  function selectionner(situation) {
    const s = normaliser(situation);
    return DEMARCHES.map((d, i) => ({ d, i }))
      .filter(({ d }) => d.si(s))
      .sort((x, y) => DELAIS[x.d.delai].rang - DELAIS[y.d.delai].rang || x.i - y.i)
      .map(({ d }) => ({
        id: d.id,
        titre: d.titre,
        organisme: d.organisme,
        delai: d.delai,
        delaiLibelle: DELAIS[d.delai].libelle,
        critere: d.critere,
        detail: typeof d.detail === "function" ? d.detail(s) : d.detail,
      }));
  }

  /** Regroupe la liste par délai, avec la date limite calculée pour chaque groupe. */
  function grouper(liste, dateDeces) {
    const groupes = [];
    for (const item of liste) {
      let g = groupes.at(-1);
      if (!g || g.delai !== item.delai) {
        const date = echeance(dateDeces, DELAIS[item.delai]);
        g = { delai: item.delai, libelle: DELAIS[item.delai].libelle, echeance: date,
              echeanceTexte: date ? `avant le ${formatDate(date)}` : "", demarches: [] };
        groupes.push(g);
      }
      g.demarches.push(item);
    }
    return groupes;
  }

  /**
   * Génère une situation fictive et complète, pour les démonstrations et les tests.
   * @param {() => number} hasard  générateur entre 0 et 1 (Math.random par défaut, remplaçable pour des tests reproductibles)
   * @param {Date} aujourdhui      date de référence (le décès est placé 1 à 6 jours avant)
   */
  function situationAleatoire(hasard = Math.random, aujourdhui = new Date()) {
    const un = (arr) => arr[Math.floor(hasard() * arr.length)];
    const parmi = (arr, p) => arr.filter(() => hasard() < p);
    const PRENOMS = ["Marcel", "Jeanne", "André", "Monique", "Karim", "Sandrine", "Lucie", "Paul", "Françoise", "Mamadou", "Hélène", "Jacques"];
    const NOMS_FAMILLE = ["Dubois", "Martin", "Benali", "Fabre", "Lefèvre", "Moreau", "Garcia", "Diallo", "Roux", "Petit"];
    const activite = un(["salarie", "retraite", "retraite", "demandeur", "fonctionnaire", "independant", "autre"]);
    const d = new Date(aujourdhui);
    d.setDate(d.getDate() - 1 - Math.floor(hasard() * 6));
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return {
      defunt: `${un(PRENOMS)} ${un(NOMS_FAMILLE)}`,
      dateDeces: iso,
      lieuDeces: hasard() < 0.9 ? "france" : "etranger",
      couple: un(["marie", "pacse", "concubinage", "seul"]),
      // Pas d'enfant mineur à charge pour une personne retraitée : on reste vraisemblable.
      enfantsMineurs: activite === "retraite" ? false : hasard() < 0.4,
      activite,
      aides: parmi(activite === "retraite" ? ["apl"] : ["apl", "rsa", "aah", "invalidite"], 0.2),
      logement: un(["proprietaire", "locataire", "autre"]),
      contrats: hasard() < 0.85,
      vehicule: hasard() < 0.6,
      credits: hasard() < 0.35,
      testament: hasard() < 0.25,
      assurances: parmi(["vie", "obseques", "deces"], 0.35),
      conseiller: un(["Nathalie", "Patrick"]),
      telephone: "01 23 45 67 89",
    };
  }

  const api = { DEMARCHES, DELAIS, selectionner, grouper, valider, normaliser, echeance, formatDate, situationAleatoire };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else global.GuideDemarches = api;
})(typeof window !== "undefined" ? window : globalThis);
