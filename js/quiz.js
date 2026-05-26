/**
 * quiz.js — Vue Quiz : rendu des accordéons, filtres, statistiques.
 *
 * Responsabilité unique : afficher et filtrer les questions en mode lecture.
 */

import { getFiltered } from './store.js';
import { escHtml } from './utils.js';

const ETIQUETTE_PAR_FREQUENCE = {
  hot:  'Très fréquente',
  med:  'Technique',
  easy: 'Générale',
};

const CLASSE_CSS_PAR_FREQUENCE = {
  hot:  'tag-hot',
  med:  'tag-med',
  easy: 'tag-easy',
};

/**
 * Identifiant du projet actuellement affiché.
 * Valeurs possibles : 'p1' | 'p2' | 'p3' | 'p4'
 * @type {string}
 */
let projetActif = 'p1';

/**
 * Initialise les onglets projet et les listeners de filtres.
 * Câble les 4 onglets (P1, P2, P3, P4) et les 4 filtres (recherche,
 * catégorie, thématique, fréquence).
 *
 * @returns {void}
 */
export function initQuiz() {
  document.getElementById('ptab-p1').addEventListener('click', evenement =>
    changerDeProjet('p1', evenement.currentTarget)
  );
  document.getElementById('ptab-p2').addEventListener('click', evenement =>
    changerDeProjet('p2', evenement.currentTarget)
  );
  document.getElementById('ptab-p3').addEventListener('click', evenement =>
    changerDeProjet('p3', evenement.currentTarget)
  );
  // Onglet P4 — Questionnaire Professionnel (ajouté d'après RE DWWM)
  document.getElementById('ptab-p4').addEventListener('click', evenement =>
    changerDeProjet('p4', evenement.currentTarget)
  );
  document.getElementById('q-search').addEventListener('input', renderQuiz);
  document.getElementById('f-cat').addEventListener('change', renderQuiz);
  document.getElementById('f-them').addEventListener('change', renderQuiz);
  document.getElementById('f-freq').addEventListener('change', renderQuiz);
}

/**
 * Change le projet actif, réinitialise les filtres et re-rend la liste.
 * @param {'p1'|'p2'} identifiantProjet
 * @param {HTMLElement} boutonOnglet - Le bouton cliqué.
 */
function changerDeProjet(identifiantProjet, boutonOnglet) {
  projetActif = identifiantProjet;
  document.querySelectorAll('.ptab').forEach(onglet => onglet.classList.remove('active'));
  boutonOnglet.classList.add('active');
  document.getElementById('q-search').value = '';
  document.getElementById('f-cat').value    = '';
  document.getElementById('f-them').value   = '';
  document.getElementById('f-freq').value   = '';
  renderQuiz();
}

/**
 * Ouvre ou ferme l'accordéon d'une carte question.
 * @param {string} identifiantCarte - L'id HTML de la carte (ex: "card-p1_1").
 */
export function toggleCard(identifiantCarte) {
  const carteElement = document.getElementById(identifiantCarte);
  if (carteElement) carteElement.classList.toggle('open');
}

/** Rend la liste des questions en appliquant les filtres actifs. */
export function renderQuiz() {
  const texteRecherche   = document.getElementById('q-search').value;
  const categorieFiltree = document.getElementById('f-cat').value;
  const thematiqueFiltree = document.getElementById('f-them').value;
  const frequenceFiltree  = document.getElementById('f-freq').value;

  // Toutes les questions du projet pour alimenter les listes déroulantes
  const toutesQuestionsProjet = getFiltered({ proj: projetActif });

  alimenterListeDeroulante(
    'f-cat',
    [...new Set(toutesQuestionsProjet.map(question => question.category).filter(Boolean))],
    'Toutes catégories'
  );
  alimenterListeDeroulante(
    'f-them',
    [...new Set(toutesQuestionsProjet.map(question => question.thematique).filter(Boolean))],
    'Toutes thématiques'
  );

  const questionsFiltrees = getFiltered({
    proj:       projetActif,
    category:   categorieFiltree,
    thematique: thematiqueFiltree,
    freq:       frequenceFiltree,
    search:     texteRecherche,
  });

  afficherStatistiques(questionsFiltrees);

  if (!questionsFiltrees.length) {
    document.getElementById('q-list').innerHTML =
      `<div class="empty"><div class="empty-icon">🔍</div><p>Aucune question trouvée.</p></div>`;
    return;
  }

  // Regroupement par catégorie (conserve l'ordre d'apparition)
  const questionsParCategorie = questionsFiltrees.reduce((accumulation, question) => {
    const nomCategorie = question.category || 'Général';
    (accumulation[nomCategorie] = accumulation[nomCategorie] || []).push(question);
    return accumulation;
  }, {});

  let numeroAffichage = 0;
  const htmlListeQuestions = Object.entries(questionsParCategorie).map(
    ([nomCategorie, questionsCategorie]) => {
      const cartesHtml = questionsCategorie.map(question => {
        numeroAffichage++;
        return construireCarte(question, numeroAffichage);
      }).join('');
      return `<div class="cat-label">${escHtml(nomCategorie)}</div>${cartesHtml}`;
    }
  ).join('');

  document.getElementById('q-list').innerHTML = htmlListeQuestions;
}

/**
 * Met à jour la barre de statistiques.
 * @param {Array<Object>} questionsFiltrees
 */
function afficherStatistiques(questionsFiltrees) {
  const nombreFrequentes = questionsFiltrees.filter(question => question.freq === 'hot').length;
  const nombreTechniques = questionsFiltrees.filter(question => question.freq === 'med').length;
  const nombreGenerales  = questionsFiltrees.filter(question => question.freq === 'easy').length;

  document.getElementById('q-stats').innerHTML = `
    <div class="sstat"><b>${questionsFiltrees.length}</b> questions</div>
    <div class="sstat"><b style="color:#e35336">●</b> Fréquentes : ${nombreFrequentes}</div>
    <div class="sstat"><b style="color:#185FA5">●</b> Techniques : ${nombreTechniques}</div>
    <div class="sstat"><b style="color:#3B6D11">●</b> Générales : ${nombreGenerales}</div>
  `;
}

/**
 * Construit le HTML d'une carte accordéon style liquid glass.
 * Animation variante C : scale + fade depuis le haut.
 * @param {Object} question - La question à afficher.
 * @param {number} numeroAffichage - Numéro séquentiel dans le badge.
 * @returns {string} HTML complet de la carte.
 */
function construireCarte(question, numeroAffichage) {
  const classeFrequence    = CLASSE_CSS_PAR_FREQUENCE[question.freq] || 'tag-easy';
  const etiquetteFrequence = ETIQUETTE_PAR_FREQUENCE[question.freq]  || '';
  const badgeThematique    = question.thematique
    ? `<span class="thematique-badge">${escHtml(question.thematique)}</span>`
    : '';

  return `
    <div class="qcard ${projetActif}" id="card-${question.id}">
      <div class="qhead" onclick="App.toggleCard('card-${question.id}')">
        <div class="qnum">${numeroAffichage}</div>
        <div class="qtxt">${question.question}${badgeThematique}</div>
        <div class="qchev" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
      <div class="qbody">
        <div class="qbody-inner">
          <span class="tag ${classeFrequence}">${etiquetteFrequence}</span>
          ${question.answer}
        </div>
      </div>
    </div>`;
}

/**
 * Alimente un élément <select> avec des options.
 * Préserve la valeur sélectionnée si elle figure toujours dans la liste.
 * @param {string} identifiantSelect - L'id du <select>.
 * @param {string[]} listeValeurs - Les valeurs à proposer.
 * @param {string} libelleOptionVide - Texte de l'option "tous".
 */
function alimenterListeDeroulante(identifiantSelect, listeValeurs, libelleOptionVide) {
  const elementSelect     = document.getElementById(identifiantSelect);
  const valeurSelectionnee = elementSelect.value;

  elementSelect.innerHTML = `<option value="">${libelleOptionVide}</option>`;

  listeValeurs.forEach(valeur => {
    const nouvelleOption       = document.createElement('option');
    nouvelleOption.value       = valeur;
    nouvelleOption.textContent = valeur;
    if (valeur === valeurSelectionnee) nouvelleOption.selected = true;
    elementSelect.appendChild(nouvelleOption);
  });
}
