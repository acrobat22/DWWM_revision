/**
 * store.js — État global de l'application + persistance localStorage.
 *
 * Responsabilité unique : gérer les données en mémoire
 * et leur synchronisation avec le stockage local.
 */

import { DATA_P1 } from './data-p1.js';
import { DATA_P2 } from './data-p2.js';
import { DATA_P3 } from './data-p3.js';

const CLE_STOCKAGE_LOCAL = 'dwwm_questions_v4';

/** @type {Array<Object>} Toutes les questions actives en mémoire. */
export let questions = [];

/**
 * Charge les données depuis localStorage.
 * Si le localStorage contient des données d'une version antérieure
 * (sans les questions P3), les données manquantes sont ajoutées
 * depuis les fichiers data initiaux sans écraser les modifications de l'utilisateur.
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

        if (!projetsPresents.has('p3')) {
          questions = [...questions, ...DATA_P3.map(question => ({ ...question }))];
          saveData();
        }
        if (!projetsPresents.has('p2')) {
          questions = [...questions, ...DATA_P2.map(question => ({ ...question }))];
          saveData();
        }
        if (!projetsPresents.has('p1')) {
          questions = [...questions, ...DATA_P1.map(question => ({ ...question }))];
          saveData();
        }

        return;
      }
    }
  } catch (erreurLectureStockage) {
    console.warn('[store] localStorage illisible, rechargement depuis les données initiales', erreurLectureStockage);
  }
  questions = [...DATA_P1, ...DATA_P2, ...DATA_P3].map(question => ({ ...question }));
  saveData();
}

/**
 * Persiste le tableau `questions` dans localStorage.
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
 * @param {Object} nouvelleQuestion - La question à ajouter.
 */
export function addQuestion(nouvelleQuestion) {
  questions.push(nouvelleQuestion);
  saveData();
}

/**
 * Met à jour une question existante par son id et persiste.
 * @param {string} identifiantQuestion - L'id de la question à modifier.
 * @param {Object} champsModifies - Les champs à écraser.
 * @returns {boolean} true si la question a été trouvée et modifiée.
 */
export function updateQuestion(identifiantQuestion, champsModifies) {
  const indexQuestion = questions.findIndex(question => question.id === identifiantQuestion);
  if (indexQuestion < 0) return false;
  questions[indexQuestion] = { ...questions[indexQuestion], ...champsModifies };
  saveData();
  return true;
}

/**
 * Supprime une question par son id et persiste.
 * @param {string} identifiantQuestion - L'id de la question à supprimer.
 * @returns {boolean} true si la question a été trouvée et supprimée.
 */
export function deleteQuestion(identifiantQuestion) {
  const nombreAvantSuppression = questions.length;
  questions = questions.filter(question => question.id !== identifiantQuestion);
  if (questions.length === nombreAvantSuppression) return false;
  saveData();
  return true;
}

/**
 * Remplace toutes les questions (ex: après import XML) et persiste.
 * @param {Array<Object>} questionsImportees
 */
export function replaceAll(questionsImportees) {
  questions = questionsImportees;
  saveData();
}

/**
 * Retourne les questions filtrées selon des critères.
 * @param {{ proj?:string, category?:string, thematique?:string, freq?:string, search?:string }} criteresFiltrage
 * @returns {Array<Object>}
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
 * @param {string} projetParent - 'p1' ou 'p2'.
 * @returns {string}
 */
export function newId(projetParent) {
  return `${projetParent}_${Date.now()}`;
}
