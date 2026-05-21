/**
 * app.js — Point d'entrée de l'application.
 *
 * Responsabilités :
 * - Initialiser tous les modules au chargement.
 * - Gérer la navigation entre pages.
 * - Exposer sur window.App les fonctions appelées depuis les onclick HTML.
 */

import { loadData }          from './store.js';
import { initQuiz, renderQuiz, toggleCard } from './quiz.js';
import { initAdmin, renderAdmin, editQuestion, confirmDelete } from './admin.js';
import { initModal, openModal, closeModal, saveQuestion } from './modal.js';
import { exportXML, importXML, handleXMLImport } from './xml.js';

/* ─── Navigation ─────────────────────────────────────────── */

/**
 * Affiche la page demandée et masque les autres.
 * @param {'quiz'|'admin'} page
 */
function showPage(page) {
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

  document.getElementById(`page-${page}`).classList.add('active');
  document.getElementById(`btn-${page}`).classList.add('active');

  if (page === 'quiz')  renderQuiz();
  if (page === 'admin') renderAdmin();
}

/* ─── Initialisation ─────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initModal();
  initQuiz();
  initAdmin();
  renderQuiz();
});

/* ─── API publique (appelée depuis les attributs onclick HTML) ─ */
// Les modules ES ne sont pas accessibles directement depuis l'HTML inline.
// On expose un objet global App pour les handlers onclick des éléments
// générés dynamiquement (accordéons, boutons du tableau admin, etc.).

window.App = {
  showPage,
  toggleCard,
  editQuestion,
  confirmDelete,
  openModal: () => openModal(null),
  closeModal,
  saveQuestion,
  exportXML,
  importXML,
  handleXMLImport,
};
