/**
 * store.js — État global de l'application + persistance localStorage.
 *
 * Responsabilité unique : gérer les données en mémoire
 * et leur synchronisation avec le stockage local.
 *
 * Projets gérés :
 *   p1 — Projet Django
 *   p2 — Projet Node.js / Socket.io
 *   p3 — Questions transversales (Git, RGPD, HTTP, Sécurité…)
 *   p4 — Questionnaire Professionnel (lecture de doc anglais + Q&A)
 */

import { DATA_P1 } from './data-p1.js';
import { DATA_P2 } from './data-p2.js';
import { DATA_P3 } from './data-p3.js';
import { DATA_P4 } from './data-p4.js';

/**
 * Clé localStorage — incrémentée à v5 pour déclencher une migration
 * automatique vers les données incluant le projet P4.
 * Modifier cette constante force le rechargement depuis les fichiers
 * data-*.js pour tous les utilisateurs.
 *
 * @constant {string}
 */
const CLE_STOCKAGE_LOCAL = 'dwwm_questions_v5';

/** @type {Array<Object>} Toutes les questions actives en mémoire. */
export let questions = [];

/**
 * Retourne le tableau initial complet (P1 + P2 + P3 + P4),
 * utilisé à l'initialisation et à la réinitialisation.
 *
 * @returns {Array<Object>} Copies fraîches de toutes les questions.
 */
function donneesInitiales() {
  return [...DATA_P1, ...DATA_P2, ...DATA_P3, ...DATA_P4].map(q => ({ ...q }));
}

/**
 * Charge les données depuis localStorage.
 *
 * Stratégie :
 *   1. Si localStorage contient des données valides → les utiliser.
 *   2. Migration partielle : si un projet (p1/p2/p3/p4) est absent,
 *      l'ajouter depuis les fichiers data sans écraser le reste.
 *   3. Si localStorage est vide ou corrompu → charger depuis les fichiers.
 */
export function loadData() {
  try {
    const donneesStockees = localStorage.getItem(CLE_STOCKAGE_LOCAL);
    if (donneesStockees) {
      const questionsDeserialisees = JSON.parse(donneesStockees);
      if (Array.isArray(questionsDeserialisees) && questionsDeserialisees.length > 0) {
        questions = questionsDeserialisees;

        // Migration : ajouter les projets absents du localStorage
        // (cas d'une mise à jour de l'application avec de nouvelles données)
        const projetsPresents = new Set(questions.map(q => q.proj));

        if (!projetsPresents.has('p4')) {
          questions = [...questions, ...DATA_P4.map(q => ({ ...q }))];
          saveData();
        }
        if (!projetsPresents.has('p3')) {
          questions = [...questions, ...DATA_P3.map(q => ({ ...q }))];
          saveData();
        }
        if (!projetsPresents.has('p2')) {
          questions = [...questions, ...DATA_P2.map(q => ({ ...q }))];
          saveData();
        }
        if (!projetsPresents.has('p1')) {
          questions = [...questions, ...DATA_P1.map(q => ({ ...q }))];
          saveData();
        }

        return;
      }
    }
  } catch (erreurLectureStockage) {
    console.warn(
      '[store] localStorage illisible, rechargement depuis les données initiales',
      erreurLectureStockage
    );
  }

  // Initialisation depuis les fichiers data (premier lancement ou localStorage vide)
  questions = donneesInitiales();
  saveData();
}

/**
 * Réinitialise toutes les questions depuis les fichiers data-*.js d'origine,
 * en effaçant toutes les modifications stockées dans localStorage.
 *
 * ⚠️  Action destructive — toutes les questions créées ou modifiées
 *     via l'admin seront perdues. Demander confirmation avant d'appeler.
 *
 * @returns {void}
 */
export function resetData() {
  // Supprime l'entrée existante pour repartir proprement
  localStorage.removeItem(CLE_STOCKAGE_LOCAL);
  // Recharge depuis les fichiers JS sources
  questions = donneesInitiales();
  saveData();
}

/**
 * Persiste le tableau `questions` dans localStorage.
 *
 * @returns {void}
 */
export function saveData() {
  try {
    localStorage.setItem(CLE_STOCKAGE_LOCAL, JSON.stringify(questions));
  } catch (erreurEcritureStockage) {
    console.error('[store] Impossible d\'écrire dans localStorage', erreurEcritureStockage);
  }
}

/**
 * Ajoute une question et persiste.
 *
 * @param {Object} nouvelleQuestion - La question à ajouter.
 * @returns {void}
 */
export function addQuestion(nouvelleQuestion) {
  questions.push(nouvelleQuestion);
  saveData();
}

/**
 * Met à jour une question existante par son id et persiste.
 *
 * @param {string} identifiantQuestion - L'id de la question à modifier.
 * @param {Object} champsModifies - Les champs à écraser.
 * @returns {boolean} true si la question a été trouvée et modifiée.
 */
export function updateQuestion(identifiantQuestion, champsModifies) {
  const indexQuestion = questions.findIndex(q => q.id === identifiantQuestion);
  if (indexQuestion < 0) return false;
  questions[indexQuestion] = { ...questions[indexQuestion], ...champsModifies };
  saveData();
  return true;
}

/**
 * Supprime une question par son id et persiste.
 *
 * @param {string} identifiantQuestion - L'id de la question à supprimer.
 * @returns {boolean} true si la question a été trouvée et supprimée.
 */
export function deleteQuestion(identifiantQuestion) {
  const nombreAvantSuppression = questions.length;
  questions = questions.filter(q => q.id !== identifiantQuestion);
  if (questions.length === nombreAvantSuppression) return false;
  saveData();
  return true;
}

/**
 * Remplace toutes les questions (ex: après import XML) et persiste.
 *
 * @param {Array<Object>} questionsImportees
 * @returns {void}
 */
export function replaceAll(questionsImportees) {
  questions = questionsImportees;
  saveData();
}

/**
 * Retourne les questions filtrées selon des critères.
 *
 * @param {Object} criteresFiltrage
 * @param {string} [criteresFiltrage.proj]        - Identifiant projet ('p1'|'p2'|'p3'|'p4').
 * @param {string} [criteresFiltrage.category]    - Catégorie exacte.
 * @param {string} [criteresFiltrage.thematique]  - Thématique exacte.
 * @param {string} [criteresFiltrage.freq]        - Niveau ('hot'|'med'|'easy').
 * @param {string} [criteresFiltrage.search]      - Texte recherché (insensible à la casse).
 * @returns {Array<Object>} Questions correspondant à tous les critères fournis.
 */
export function getFiltered({
  proj:       projetCible,
  category:   categorieCible,
  thematique: thematiqueCible,
  freq:       frequenceCible,
  search:     texteRecherche,
} = {}) {
  return questions.filter(question => {
    if (projetCible     && question.proj       !== projetCible)     return false;
    if (categorieCible  && question.category   !== categorieCible)  return false;
    if (thematiqueCible && question.thematique !== thematiqueCible) return false;
    if (frequenceCible  && question.freq       !== frequenceCible)  return false;
    if (texteRecherche) {
      const contenuIndexe = `${question.question} ${question.answer} ${question.category} ${question.thematique}`.toLowerCase();
      if (!contenuIndexe.includes(texteRecherche.toLowerCase())) return false;
    }
    return true;
  });
}

/**
 * Génère un identifiant unique pour une nouvelle question.
 *
 * @param {string} projetParent - Identifiant du projet ('p1'|'p2'|'p3'|'p4').
 * @returns {string} Identifiant de la forme "p1_1700000000000".
 */
export function newId(projetParent) {
  return `${projetParent}_${Date.now()}`;
}
