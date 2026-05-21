/**
 * utils.js — Fonctions utilitaires partagées entre tous les modules.
 *
 * Responsabilité unique : fournir des helpers sans dépendances.
 */

/**
 * Échappe les caractères HTML dangereux pour insertion dans du texte.
 * @param {string} str
 * @returns {string}
 */
export function escHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

/**
 * Échappe pour insertion dans un attribut HTML (alias d'escHtml).
 * @param {string} str
 * @returns {string}
 */
export function escAttr(str) {
  return escHtml(str);
}

/** @type {number|null} */
let toastTimer = null;

/**
 * Affiche un message toast pendant ~2,8 secondes.
 * @param {string} msg - Message à afficher.
 */
export function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}
