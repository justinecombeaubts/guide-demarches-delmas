/* Interface : lit la saisie, appelle le moteur de règles, affiche le document. */
(function () {
  "use strict";
  const { selectionner, grouper, valider } = window.GuideDemarches;
  const $ = (id) => document.getElementById(id);
  const CHAMPS_TEXTE = ["defunt", "dateDeces", "conseiller", "telephone"];

  // Réponses à choix unique (boutons)
  const etat = { lieuDeces: null, couple: null, enfantsMineurs: null, activite: null, logement: null };

  // Échappe le texte saisi avant de l'insérer dans la page.
  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function lireSituation() {
    const s = { ...etat };
    document.querySelectorAll("[data-liste]").forEach((g) => {
      s[g.dataset.liste] = [...g.querySelectorAll("input:checked")].map((i) => i.value);
    });
    document.querySelectorAll("[data-bool]").forEach((i) => { s[i.dataset.bool] = i.checked; });
    CHAMPS_TEXTE.forEach((id) => { s[id] = $(id).value.trim(); });
    return s;
  }

  function rendre() {
    const s = lireSituation();
    const manque = valider(s);
    $("relu").checked = false;
    $("imprimer").disabled = true;

    if (manque.length) {
      $("relu").disabled = true;
      $("compteur").textContent = "Le document pour la famille";
      $("document").innerHTML = `<p class="vide">Encore à renseigner : ${esc(manque.join(", "))}.<br>Le document apparaîtra ici.</p>`;
      return;
    }
    $("relu").disabled = false;

    const liste = selectionner(s);
    const groupes = grouper(liste, s.dateDeces);
    $("compteur").textContent = `${liste.length} démarches pour cette famille`;
    const aujourdhui = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    const pour = s.defunt ? ` à la suite du décès de ${esc(s.defunt)}` : "";

    $("document").innerHTML = `
      <div class="doc-entete">
        <div class="doc-logo">Pompes funèbres Delmas</div>
        <div class="doc-date">Remis le ${aujourdhui}</div>
      </div>
      <h1>Les démarches à venir</h1>
      <p class="doc-intro">
        Ce document rassemble les démarches à effectuer${pour}, classées selon leurs délais.
        Vous n'avez pas à tout faire aujourd'hui : vous pouvez avancer étape par étape,
        et cocher chaque démarche une fois faite.
      </p>
      ${groupes.map((g) => `
        <section class="doc-groupe">
          <h3>${esc(g.libelle)}${g.echeanceTexte ? ` <span class="delai">${esc(g.echeanceTexte)}</span>` : ""}</h3>
          <ol class="doc-liste">
            ${g.demarches.map((d) => `
              <li>
                <span class="case" aria-hidden="true"></span>
                <div>
                  <strong>${esc(d.titre)}</strong>
                  <span class="organisme"> · ${esc(d.organisme)}</span>
                  <p>${esc(d.detail)}</p>
                </div>
              </li>`).join("")}
          </ol>
        </section>`).join("")}
      <p class="doc-contact">
        Une question, un doute ? ${s.conseiller ? esc(s.conseiller) + " reste" : "Nous restons"}
        à votre écoute${s.telephone ? ` au <strong>${esc(s.telephone)}</strong>` : ""}.
      </p>
      <p class="doc-note">Ce document est un repère établi avec votre conseiller ; il ne remplace pas l'avis d'un notaire ou des organismes concernés.</p>
    `;
  }

  // Boutons à choix unique
  document.querySelectorAll(".choix").forEach((groupe) => {
    groupe.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const v = btn.dataset.val;
      etat[groupe.dataset.champ] = v === "true" ? true : v === "false" ? false : v;
      majBoutons();
      rendre();
    });
  });

  function majBoutons() {
    document.querySelectorAll(".choix").forEach((groupe) => {
      const val = String(etat[groupe.dataset.champ]);
      groupe.querySelectorAll("button").forEach((b) => b.classList.toggle("actif", b.dataset.val === val));
    });
  }

  $("formulaire").addEventListener("change", rendre);
  CHAMPS_TEXTE.forEach((id) => $(id).addEventListener("input", rendre));

  // Contrôle humain : impression seulement après relecture avec la famille
  $("relu").addEventListener("change", (e) => { $("imprimer").disabled = !e.target.checked; });
  $("imprimer").addEventListener("click", () => window.print());

  // Données de test
  const select = $("cas");
  window.CAS_DE_TEST.forEach((c, i) => select.add(new Option(c.nom, i)));
  select.addEventListener("change", () => {
    const cas = window.CAS_DE_TEST[select.value];
    if (cas) remplir(cas.situation);
  });

  // Remplissage de test automatique : une situation fictive tirée au hasard à chaque clic
  $("remplissage").addEventListener("click", () => {
    select.value = "";
    remplir(window.GuideDemarches.situationAleatoire());
  });

  function remplir(s) {
    for (const k of Object.keys(etat)) etat[k] = s[k];
    document.querySelectorAll("[data-liste]").forEach((g) => {
      g.querySelectorAll("input").forEach((i) => { i.checked = (s[g.dataset.liste] || []).includes(i.value); });
    });
    document.querySelectorAll("[data-bool]").forEach((i) => { i.checked = !!s[i.dataset.bool]; });
    CHAMPS_TEXTE.forEach((k) => { $(k).value = s[k] || ""; });
    majBoutons();
    rendre();
  }

  rendre();
})();
