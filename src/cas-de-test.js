/* Données de test (fictives). Chargeables depuis l'interface en un clic.
   "attendu" = la liste exacte des démarches, dans l'ordre, vérifiée à la main. */
(function (global) {
  const contact = { conseiller: "Nathalie", telephone: "01 23 45 67 89" };
  const CAS_DE_TEST = [
    {
      nom: "Marcel Dubois — retraité, marié, propriétaire",
      situation: {
        defunt: "Marcel Dubois", dateDeces: "2026-11-24", lieuDeces: "france",
        couple: "marie", enfantsMineurs: false, activite: "retraite", aides: [],
        logement: "proprietaire", contrats: true, vehicule: true, credits: false, testament: false,
        assurances: ["obseques"], ...contact,
      },
      attendu: [
        "acte-deces",
        "banques", "cpam", "assurances", "assurance-habitation", "contrats", "assurance-auto",
        "caisses-retraite", "mutuelle",
        "carte-grise",
        "notaire",
        "impots", "declaration-conjoint",
        "reversion", "livret-famille", "comptes-en-ligne",
      ],
    },
    {
      nom: "Sandrine Martin — salariée, concubinage, 2 enfants mineurs, locataire",
      situation: {
        defunt: "Sandrine Martin", dateDeces: "2026-11-20", lieuDeces: "france",
        couple: "concubinage", enfantsMineurs: true, activite: "salarie", aides: ["apl"],
        logement: "locataire", contrats: true, vehicule: false, credits: true, testament: false,
        assurances: ["deces"], ...contact,
      },
      attendu: [
        "acte-deces",
        "employeur",
        "banques", "cpam", "caf", "assurances", "assurance-emprunteur", "bailleur", "contrats",
        "mutuelle",
        "impots",
        "comptes-en-ligne",
        "juge-tutelles",
      ],
    },
    {
      nom: "Karim Benali — décès à l'étranger, pacsé, demandeur d'emploi",
      situation: {
        defunt: "Karim Benali", dateDeces: "", lieuDeces: "etranger",
        couple: "pacse", enfantsMineurs: false, activite: "demandeur", aides: ["rsa", "invalidite"],
        logement: "autre", contrats: false, vehicule: true, credits: false, testament: true,
        assurances: ["vie"], conseiller: "Patrick", telephone: "01 98 76 54 32",
      },
      attendu: [
        "consulat", "france-travail", "banques", "cpam", "caf", "invalidite", "assurances", "assurance-auto",
        "mutuelle",
        "carte-grise",
        "notaire",
        "impots", "declaration-conjoint",
        "comptes-en-ligne",
      ],
    },
    {
      nom: "Lucie Fabre — fonctionnaire, seule, enfants mineurs, propriétaire",
      situation: {
        defunt: "Lucie Fabre", dateDeces: "2026-11-25", lieuDeces: "france",
        couple: "seul", enfantsMineurs: true, activite: "fonctionnaire", aides: [],
        logement: "proprietaire", contrats: true, vehicule: false, credits: true, testament: true,
        assurances: ["vie", "deces"], ...contact,
      },
      attendu: [
        "acte-deces",
        "administration",
        "banques", "cpam", "caf", "assurances", "assurance-emprunteur", "assurance-habitation", "contrats",
        "mutuelle",
        "notaire",
        "impots",
        "comptes-en-ligne",
        "juge-tutelles",
      ],
    },
  ];
  if (typeof module !== "undefined" && module.exports) module.exports = CAS_DE_TEST;
  else global.CAS_DE_TEST = CAS_DE_TEST;
})(typeof window !== "undefined" ? window : globalThis);
