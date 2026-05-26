/**
 * app.js — Point d'entrée de l'application DWWM Entraînement Oral.
 *
 * Responsabilités :
 *   - Initialiser tous les modules au chargement de la page.
 *   - Gérer la navigation entre pages (garde d'authentification sur admin).
 *   - Exposer sur window.App les fonctions appelées depuis les onclick HTML.
 *
 * Architecture des modules :
 *   store.js   → données en mémoire + localStorage
 *   quiz.js    → affichage et filtrage des questions (mode lecture)
 *   admin.js   → tableau d'administration des questions
 *   modal.js   → formulaire de création/édition d'une question
 *   xml.js     → export et import XML
 *   auth.js    → authentification admin (session locale)
 */

import { loadData, resetData }                                             from './store.js';
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
 * @param {'quiz'|'admin'} identifiantPage - Identifiant de la page cible.
 * @returns {void}
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

/* ─── Réinitialisation des données ───────────────────────── */

/**
 * Efface le localStorage et recharge toutes les questions
 * depuis les fichiers data-*.js d'origine.
 *
 * ⚠️  Action destructive confirmée par l'utilisateur via window.confirm.
 *     Toutes les modifications apportées via l'admin (ajout, édition,
 *     suppression) seront perdues définitivement.
 *
 * @returns {void}
 */
function reinitialiserDonnees() {
  const confirme = window.confirm(
    '⚠️ Réinitialiser les données ?\n\n' +
    'Toutes vos questions créées ou modifiées seront effacées.\n' +
    'Les données reviendront à leur état d\'origine (fichiers data-*.js).\n\n' +
    'Cette action est irréversible.'
  );

  if (!confirme) return;

  // Recharge depuis les fichiers JS sources (efface le localStorage)
  resetData();

  // Rafraîchit l'interface selon la page active
  if (document.getElementById('page-quiz').classList.contains('active')) {
    renderQuiz();
  } else {
    renderAdmin();
  }

  // Notification visuelle (utilise le système de toast de l'app si disponible)
  const toastElement = document.getElementById('toast');
  if (toastElement) {
    toastElement.textContent = '✅ Données réinitialisées depuis les fichiers sources.';
    toastElement.classList.add('show');
    setTimeout(() => toastElement.classList.remove('show'), 3000);
  }
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

/* ─── API publique ────────────────────────────────────────── */
// Les modules ES ne sont pas accessibles directement depuis les attributs
// onclick inline du HTML. On expose un objet global App comme pont.
// Chaque propriété correspond à une fonction callable depuis le HTML.

window.App = {
  showPage,
  toggleCard,
  editQuestion,
  confirmDelete,
  openModal:           () => openModal(null),
  closeModal,
  saveQuestion,
  exportXML,
  importXML,
  handleXMLImport,
  logout,
  submitLogin,
  copierCodeJS,
  reinitialiserDonnees, // 🔄 Nouveau : recharge les données depuis les fichiers sources
};
