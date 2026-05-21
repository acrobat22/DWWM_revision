/**
 * app.js — Point d'entrée de l'application.
 *
 * Responsabilités :
 * - Initialiser tous les modules au chargement.
 * - Gérer la navigation entre pages (avec garde d'authentification sur admin).
 * - Exposer sur window.App les fonctions appelées depuis les onclick HTML.
 */

import { loadData }                                    from './store.js';
import { initQuiz, renderQuiz, toggleCard }            from './quiz.js';
import { initAdmin, renderAdmin, editQuestion, confirmDelete } from './admin.js';
import { initModal, openModal, closeModal, saveQuestion }      from './modal.js';
import { exportXML, importXML, handleXMLImport }       from './xml.js';
import { initAuth, isAuthenticated, showLoginOverlay, logout, submitLogin } from './auth.js';

/* ─── Navigation ─────────────────────────────────────────── */

/**
 * Affiche la page demandée et masque les autres.
 * Intercepte l'accès à "admin" si l'utilisateur n'est pas authentifié.
 *
 * @param {'quiz'|'admin'} page
 */
function showPage(page) {
  if (page === 'admin' && !isAuthenticated()) {
    showLoginOverlay();
    return;
  }

  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

  document.getElementById(`page-${page}`).classList.add('active');
  document.getElementById(`btn-${page}`).classList.add('active');

  // Affiche/masque le bouton de déconnexion
  document.getElementById('btn-logout').classList.toggle('hidden', page !== 'admin');

  if (page === 'quiz')  renderQuiz();
  if (page === 'admin') renderAdmin();
}

/* ─── Initialisation ─────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initAuth();
  initModal();
  initQuiz();
  initAdmin();
  renderQuiz();
});

/* ─── API publique (appelée depuis les attributs onclick HTML) ─ */

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
  logout,
  submitLogin,
};
