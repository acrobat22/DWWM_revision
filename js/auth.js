/**
 * auth.js — Authentification de l'interface d'administration.
 *
 * Responsabilité unique : vérifier l'identité avant d'accéder à la page admin
 * et gérer la session (localStorage) + la déconnexion.
 *
 * Sécurité :
 * - Le mot de passe n'est jamais comparé en clair.
 * - Seul son hash SHA-256 (via Web Crypto API) est comparé à la valeur stockée.
 * - La session est mémorisée en sessionStorage (effacée à la fermeture du navigateur).
 *
 * Credentials : user=toto / pwd=toto
 * Hash SHA-256 de "toto" :
 *   31f7a65e315586ac198bd798b6629ce4903d0899476d5741a9f32e2e521b6a66
 */

/** Hash SHA-256 attendu pour le mot de passe "toto". */
const PWD_HASH = '31f7a65e315586ac198bd798b6629ce4903d0899476d5741a9f32e2e521b6a66';

/** Identifiant attendu (en clair — pas sensible). */
const VALID_USER = 'toto';

/** Clé de session dans sessionStorage. */
const SESSION_KEY = 'dwwm_admin_auth';

/**
 * Calcule le hash SHA-256 d'une chaîne de caractères.
 * Utilise l'API Web Crypto native du navigateur (pas de dépendance externe).
 *
 * @param {string} str - La chaîne à hacher.
 * @returns {Promise<string>} Hash hexadécimal en minuscules.
 */
async function sha256(str) {
  const buffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(str)
  );
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Vérifie si la session admin est active.
 * @returns {boolean}
 */
export function isAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

/** Ouvre l'overlay de connexion. */
export function showLoginOverlay() {
  document.getElementById('login-overlay').classList.remove('hidden');
  document.getElementById('login-user').value = '';
  document.getElementById('login-pwd').value  = '';
  document.getElementById('login-error').textContent = '';
  document.getElementById('login-user').focus();
}

/** Ferme l'overlay de connexion. */
export function hideLoginOverlay() {
  document.getElementById('login-overlay').classList.add('hidden');
}

/**
 * Tente de connecter l'utilisateur avec les valeurs des champs du formulaire.
 * Compare le hash du mot de passe saisi à la valeur de référence.
 * Appelé par le bouton "Connexion" et la touche Entrée.
 */
export async function submitLogin() {
  const user    = document.getElementById('login-user').value.trim();
  const pwd     = document.getElementById('login-pwd').value;
  const errEl   = document.getElementById('login-error');
  const btnEl   = document.getElementById('login-submit');

  errEl.textContent = '';
  btnEl.disabled    = true;
  btnEl.textContent = 'Vérification…';

  try {
    const hash = await sha256(pwd);
    if (user === VALID_USER && hash === PWD_HASH) {
      sessionStorage.setItem(SESSION_KEY, '1');
      hideLoginOverlay();
      // Déclenche l'affichage de la page admin via App
      window.App.showPage('admin');
    } else {
      errEl.textContent = 'Identifiant ou mot de passe incorrect.';
      document.getElementById('login-pwd').value = '';
      document.getElementById('login-pwd').focus();
    }
  } catch (e) {
    errEl.textContent = 'Erreur lors de la vérification.';
    console.error('[auth] sha256 error', e);
  } finally {
    btnEl.disabled    = false;
    btnEl.textContent = 'Connexion';
  }
}

/** Déconnecte l'utilisateur et retourne à la page quiz. */
export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.App.showPage('quiz');
}

/** Initialise les listeners du formulaire de connexion. */
export function initAuth() {
  // Soumettre avec la touche Entrée sur le champ mot de passe
  document.getElementById('login-pwd').addEventListener('keydown', e => {
    if (e.key === 'Enter') submitLogin();
  });
  document.getElementById('login-user').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('login-pwd').focus();
  });
}
