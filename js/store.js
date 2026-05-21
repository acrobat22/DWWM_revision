/**
 * store.js — État global de l'application + persistance localStorage.
 *
 * Responsabilité unique : gérer les données en mémoire
 * et leur synchronisation avec le stockage local.
 */

import { DATA_P1 } from './data-p1.js';
import { DATA_P2 } from './data-p2.js';

const STORAGE_KEY = 'dwwm_questions_v3';

/** @type {Array<Object>} questions actives en mémoire */
export let questions = [];

/**
 * Charge les données depuis localStorage.
 * Utilise les données initiales si le stockage est vide ou corrompu.
 */
export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (Array.isArray(saved) && saved.length > 0) {
        questions = saved;
        return;
      }
    }
  } catch (e) {
    console.warn('[store] localStorage illisible, rechargement depuis INIT_DATA', e);
  }
  questions = [...DATA_P1, ...DATA_P2].map(q => ({ ...q }));
  saveData();
}

/**
 * Persiste le tableau `questions` dans localStorage.
 */
export function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  } catch (e) {
    console.error('[store] Impossible d\'écrire dans localStorage', e);
  }
}

/**
 * Ajoute une question et persiste.
 * @param {Object} q - La question à ajouter.
 */
export function addQuestion(q) {
  questions.push(q);
  saveData();
}

/**
 * Met à jour une question existante par son id et persiste.
 * @param {string} id
 * @param {Object} updates - Champs à modifier.
 * @returns {boolean} true si trouvée et modifiée.
 */
export function updateQuestion(id, updates) {
  const idx = questions.findIndex(q => q.id === id);
  if (idx < 0) return false;
  questions[idx] = { ...questions[idx], ...updates };
  saveData();
  return true;
}

/**
 * Supprime une question par son id et persiste.
 * @param {string} id
 * @returns {boolean} true si trouvée et supprimée.
 */
export function deleteQuestion(id) {
  const before = questions.length;
  questions = questions.filter(q => q.id !== id);
  if (questions.length === before) return false;
  saveData();
  return true;
}

/**
 * Remplace toutes les questions (ex: après import XML) et persiste.
 * @param {Array<Object>} newQuestions
 */
export function replaceAll(newQuestions) {
  questions = newQuestions;
  saveData();
}

/**
 * Retourne les questions filtrées selon des critères.
 * @param {{ proj?:string, category?:string, thematique?:string, freq?:string, search?:string }} filters
 * @returns {Array<Object>}
 */
export function getFiltered({ proj, category, thematique, freq, search } = {}) {
  return questions.filter(q => {
    if (proj      && q.proj       !== proj)      return false;
    if (category  && q.category   !== category)  return false;
    if (thematique && q.thematique !== thematique) return false;
    if (freq      && q.freq       !== freq)      return false;
    if (search) {
      const hay = `${q.question} ${q.answer} ${q.category} ${q.thematique}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  });
}

/**
 * Génère un identifiant unique pour une nouvelle question.
 * @param {string} proj
 * @returns {string}
 */
export function newId(proj) {
  return `${proj}_${Date.now()}`;
}
