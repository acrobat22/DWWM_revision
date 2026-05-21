/**
 * auth.js — Authentification de l'interface d'administration.
 *
 * Responsabilité unique : vérifier l'identité avant d'accéder à la page admin
 * et gérer la session (sessionStorage) + la déconnexion.
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

/** Hash SHA-256 de référence pour le mot de passe autorisé ("toto"). */
const HASH_MOT_DE_PASSE_ATTENDU = '31f7a65e315586ac198bd798b6629ce4903d0899476d5741a9f32e2e521b6a66';

/** Identifiant attendu (en clair — non sensible). */
const IDENTIFIANT_ADMINISTRATEUR = 'toto';

/** Clé utilisée pour stocker la session dans sessionStorage. */
const CLE_SESSION_ADMIN = 'dwwm_admin_auth';

/**
 * Calcule le hash SHA-256 d'une chaîne de caractères.
 * Utilise l'API Web Crypto native du navigateur (pas de dépendance externe).
 *
 * @param {string} chaineAHacher
 * @returns {Promise<string>} Hash hexadécimal en minuscules.
 */
async function calculerHashSHA256(chaineAHacher) {
  const bufferEncode = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(chaineAHacher)
  );
  return Array.from(new Uint8Array(bufferEncode))
    .map(octet => octet.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Vérifie si la session admin est active.
 * @returns {boolean}
 */
export function isAuthenticated() {
  return sessionStorage.getItem(CLE_SESSION_ADMIN) === '1';
}

/** Ouvre l'overlay de connexion et réinitialise les champs. */
export function showLoginOverlay() {
  document.getElementById('login-overlay').classList.remove('hidden');
  document.getElementById('login-user').value          = '';
  document.getElementById('login-pwd').value           = '';
  document.getElementById('login-error').textContent   = '';
  document.getElementById('login-user').focus();
}

/** Ferme l'overlay de connexion. */
export function hideLoginOverlay() {
  document.getElementById('login-overlay').classList.add('hidden');
}

/**
 * Tente de connecter l'utilisateur avec les valeurs saisies dans le formulaire.
 * Compare le hash SHA-256 du mot de passe saisi à la valeur de référence.
 * Appelé par le bouton "Connexion" et la touche Entrée.
 */
export async function submitLogin() {
  const identifiantSaisi   = document.getElementById('login-user').value.trim();
  const motDePasseSaisi    = document.getElementById('login-pwd').value;
  const zoneMessageErreur  = document.getElementById('login-error');
  const boutonConnexion    = document.getElementById('login-submit');

  zoneMessageErreur.textContent = '';
  boutonConnexion.disabled      = true;
  boutonConnexion.textContent   = 'Vérification…';

  try {
    const hashMotDePasseSaisi = await calculerHashSHA256(motDePasseSaisi);

    if (identifiantSaisi === IDENTIFIANT_ADMINISTRATEUR && hashMotDePasseSaisi === HASH_MOT_DE_PASSE_ATTENDU) {
      sessionStorage.setItem(CLE_SESSION_ADMIN, '1');
      hideLoginOverlay();
      window.App.showPage('admin');
    } else {
      zoneMessageErreur.textContent = 'Identifiant ou mot de passe incorrect.';
      document.getElementById('login-pwd').value = '';
      document.getElementById('login-pwd').focus();
    }
  } catch (erreurCalculHash) {
    zoneMessageErreur.textContent = 'Erreur lors de la vérification.';
    console.error('[auth] Erreur SHA-256', erreurCalculHash);
  } finally {
    boutonConnexion.disabled    = false;
    boutonConnexion.textContent = 'Connexion';
  }
}

/** Déconnecte l'utilisateur et retourne à la page quiz. */
export function logout() {
  sessionStorage.removeItem(CLE_SESSION_ADMIN);
  window.App.showPage('quiz');
}

/** Initialise les listeners du formulaire de connexion. */
export function initAuth() {
  document.getElementById('login-pwd').addEventListener('keydown', evenementClavier => {
    if (evenementClavier.key === 'Enter') submitLogin();
  });
  document.getElementById('login-user').addEventListener('keydown', evenementClavier => {
    if (evenementClavier.key === 'Enter') document.getElementById('login-pwd').focus();
  });
}
