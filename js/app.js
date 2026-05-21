/**
 * app.js — Point d'entrée de l'application.
 *
 * Responsabilités :
 * - Initialiser tous les modules au chargement.
 * - Gérer la navigation entre pages (avec garde d'authentification sur admin).
 * - Exposer sur window.App les fonctions appelées depuis les onclick HTML.
 */

import { loadData }                                                        from './store.js';
import { initQuiz, renderQuiz, toggleCard }                                from './quiz.js';
import { initAdmin, renderAdmin, editQuestion, confirmDelete, copierCodeJS } from './admin.js';
import { initModal, openModal, closeModal, saveQuestion }                  from './modal.js';
import { exportXML, importXML, handleXMLImport }                           from './xml.js';
import { initAuth, isAuthenticated, showLoginOverlay, logout, submitLogin } from './auth.js';

/* ─── Navigation ─────────────────────────────────────────── */

/**
 * Affiche la page demandée et masque les autres.
 * Intercepte l'accès à "admin" si l'utilisateur n'est pas authentifié.
 *
 * @param {'quiz'|'admin'} identifiantPage
 */
function showPage(identifiantPage) {
  if (identifiantPage === 'admin' && !isAuthenticated()) {
    showLoginOverlay();
    return;
  }

  document.querySelectorAll('.page').forEach(elementPage =>
    elementPage.classList.remove('active')
  );
  document.querySelectorAll('.nav-btn').forEach(boutonNav =>
    boutonNav.classList.remove('active')
  );

  document.getElementById(`page-${identifiantPage}`).classList.add('active');
  document.getElementById(`btn-${identifiantPage}`).classList.add('active');

  // Affiche le bouton de déconnexion uniquement sur la page admin
  document.getElementById('btn-logout').classList.toggle('hidden', identifiantPage !== 'admin');

  if (identifiantPage === 'quiz')  renderQuiz();
  if (identifiantPage === 'admin') renderAdmin();
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
// Les modules ES ne sont pas accessibles directement depuis les onclick inline.
// On expose un objet global App pour les handlers des éléments générés dynamiquement.

window.App = {
  showPage,
  toggleCard,
  editQuestion,
  confirmDelete,
  openModal:      () => openModal(null),
  closeModal,
  saveQuestion,
  exportXML,
  importXML,
  handleXMLImport,
  logout,
  submitLogin,
  copierCodeJS,
};
