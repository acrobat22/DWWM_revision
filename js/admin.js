/**
 * admin.js — Vue Administration : tableau CRUD des questions.
 *
 * Responsabilité unique : afficher, rechercher, supprimer les questions
 * et générer le code JS à copier dans les fichiers data.
 */

import { questions, getFiltered, deleteQuestion } from './store.js';
import { escHtml, escAttr, showToast } from './utils.js';
import { openModal } from './modal.js';

const ETIQUETTE_FREQUENCE = { hot: '🔴 Fréq.', med: '🔵 Tech.', easy: '🟢 Gén.' };
const CLASSE_FREQUENCE    = { hot: 'tag-hot',  med: 'tag-med',  easy: 'tag-easy' };

/** Initialise les listeners de la vue admin. */
export function initAdmin() {
  document.getElementById('a-proj').addEventListener('change', renderAdmin);
  document.getElementById('a-search').addEventListener('input', renderAdmin);
}

/** Rend le tableau des questions avec les filtres actifs. */
export function renderAdmin() {
  const projetFiltré   = document.getElementById('a-proj').value;
  const recherche      = document.getElementById('a-search').value;

  const questionsFiltrees = getFiltered({ proj: projetFiltré || undefined, search: recherche });

  if (!questionsFiltrees.length) {
    document.getElementById('a-table-wrap').innerHTML =
      `<div class="empty"><div class="empty-icon">📭</div><p>Aucune question.</p></div>`;
    return;
  }

  const lignesTableau = questionsFiltrees.map(construireLigneTableau).join('');

  document.getElementById('a-table-wrap').innerHTML = `
    <div style="overflow-x:auto">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Proj</th>
            <th>Question</th>
            <th>Catégorie</th>
            <th>Thématique</th>
            <th>Fréquence</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>${lignesTableau}</tbody>
      </table>
    </div>
    <p style="font-size:12px;color:#aaa;margin-top:8px;text-align:right">
      ${questionsFiltrees.length} question(s)
    </p>
  `;
}

/**
 * Construit une ligne <tr> pour une question.
 * @param {Object} question
 * @returns {string} HTML de la ligne.
 */
function construireLigneTableau(question) {
  const badgeProjet = question.proj === 'p1'
    ? `<span class="proj-badge badge-p1">P1</span>`
    : question.proj === 'p2'
      ? `<span class="proj-badge badge-p2">P2</span>`
      : question.proj === 'p4'
        ? `<span class="proj-badge badge-p4">P4</span>`  // Questionnaire Professionnel
        : `<span class="proj-badge badge-p3">P3</span>`;

  const badgeFrequence = `<span class="tag ${CLASSE_FREQUENCE[question.freq] || 'tag-easy'}" style="margin:0">
    ${ETIQUETTE_FREQUENCE[question.freq] || ''}
  </span>`;

  const affichageThematique = question.thematique
    ? `<span class="thematique-badge">${escHtml(question.thematique)}</span>`
    : '—';

  // Les id sont passés via data-attribute pour éviter les problèmes d'apostrophes/guillemets
  return `
    <tr>
      <td>${badgeProjet}</td>
      <td class="qtxt-cell" title="${escAttr(question.question)}">${question.question}</td>
      <td>${escHtml(question.category || '')}</td>
      <td>${affichageThematique}</td>
      <td>${badgeFrequence}</td>
      <td>
        <div class="actions">
          <button class="btn btn-secondary btn-sm"
                  data-id="${escAttr(question.id)}"
                  onclick="App.editQuestion(this.dataset.id)">✏️</button>
          <button class="btn btn-danger btn-sm"
                  data-id="${escAttr(question.id)}"
                  onclick="App.confirmDelete(this.dataset.id)">🗑</button>
        </div>
      </td>
    </tr>`;
}

/**
 * Ouvre le modal d'édition pour une question.
 * @param {string} identifiantQuestion
 */
export function editQuestion(identifiantQuestion) {
  openModal(identifiantQuestion);
}

/**
 * Demande confirmation puis supprime une question.
 * @param {string} identifiantQuestion
 */
export function confirmDelete(identifiantQuestion) {
  if (!confirm('Supprimer cette question définitivement ?')) return;
  const suppressionReussie = deleteQuestion(identifiantQuestion);
  showToast(suppressionReussie ? '🗑 Question supprimée.' : '❌ Question introuvable.');
  renderAdmin();
}

// ─────────────────────────────────────────────────────────
// EXPORT JS — génère le code à coller dans data-p1.js / data-p2.js
// ─────────────────────────────────────────────────────────

/**
 * Sérialise une question en ligne JS valide pour les fichiers data.
 * Les contenus sont embarqués dans des template literals (backticks).
 * Les backticks et ${} présents dans les données sont échappés.
 *
 * @param {Object} question
 * @returns {string} Une ligne JS de la forme {id:"...", proj:"...", ...}
 */
function serialiserQuestionEnJS(question) {
  // Échappe les caractères qui casseraient un template literal JS
  const echapperTemplateLiteral = texte =>
    String(texte ?? '')
      .replace(/\\/g, '\\\\')
      .replace(/`/g,  '\\`')
      .replace(/\$\{/g, '\\${');

  const identifiant  = echapperTemplateLiteral(question.id);
  const projet       = echapperTemplateLiteral(question.proj);
  const categorie    = echapperTemplateLiteral(question.category   ?? '');
  const thematique   = echapperTemplateLiteral(question.thematique ?? '');
  const texteQuestion = echapperTemplateLiteral(question.question  ?? '');
  const texteReponse  = echapperTemplateLiteral(question.answer    ?? '');
  const frequence    = echapperTemplateLiteral(question.freq       ?? 'easy');
  const numero       = Number.isInteger(question.num) ? question.num : 0;

  return (
    `  {id:\`${identifiant}\`,proj:\`${projet}\`,num:${numero},` +
    `category:\`${categorie}\`,thematique:\`${thematique}\`,` +
    `question:\`${texteQuestion}\`,answer:\`${texteReponse}\`,freq:\`${frequence}\`,}`
  );
}

/**
 * Génère et copie dans le presse-papiers le contenu JS complet
 * du fichier data du projet sélectionné (p1 ou p2).
 *
 * L'utilisateur n'a ensuite qu'à ouvrir le fichier data-p1.js (ou data-p2.js)
 * dans son éditeur, tout sélectionner (Ctrl+A) et coller (Ctrl+V).
 *
 * @param {'p1'|'p2'} projetCible - Le projet à exporter.
 */
export async function copierCodeJS(projetCible) {
  const questionsProjet = questions.filter(question => question.proj === projetCible);

  if (!questionsProjet.length) {
    showToast(`⚠️ Aucune question pour le ${projetCible === 'p1' ? 'Projet 1' : projetCible === 'p2' ? 'Projet 2' : projetCible === 'p3' ? 'Transversales' : 'Questionnaire Pro'}.`);
    return;
  }

  const nomConstante = projetCible === 'p1' ? 'DATA_P1' : projetCible === 'p2' ? 'DATA_P2' : 'DATA_P3';
  const nomFichier   = projetCible === 'p1' ? 'data-p1.js' : projetCible === 'p2' ? 'data-p2.js' : projetCible === 'p3' ? 'data-p3.js' : 'data-p4.js';

  const lignesJS = questionsProjet.map(serialiserQuestionEnJS).join(',\n');

  const codeComplet = [
    `// Fichier généré automatiquement — coller dans js/${nomFichier}`,
    `// ${questionsProjet.length} questions — ${new Date().toLocaleString('fr-FR')}`,
    ``,
    `export const ${nomConstante} = [`,
    lignesJS,
    `];`,
    ``
  ].join('\n');

  try {
    await navigator.clipboard.writeText(codeComplet);
    showToast(`📋 Code JS du ${nomFichier} copié ! Collez-le dans votre éditeur.`);
  } catch {
    // Fallback si l'API Clipboard n'est pas disponible (ex: http sans localhost)
    afficherModaleCodeJS(codeComplet, nomFichier);
  }
}

/**
 * Fallback : affiche le code JS dans une modale texte si le presse-papiers
 * n'est pas accessible (navigateur sans HTTPS ou permission refusée).
 *
 * @param {string} codeJS     - Le code JS à afficher.
 * @param {string} nomFichier - Nom du fichier cible (pour le titre).
 */
function afficherModaleCodeJS(codeJS, nomFichier) {
  // Réutilise la modale existante avec un contenu temporaire
  const zoneAffichage = document.createElement('div');
  zoneAffichage.style.cssText =
    'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:400;' +
    'display:flex;align-items:center;justify-content:center;padding:16px';

  zoneAffichage.innerHTML = `
    <div style="background:#fff;border-radius:12px;width:100%;max-width:700px;
                max-height:80vh;display:flex;flex-direction:column;overflow:hidden">
      <div style="background:#e35336;color:#fff;padding:14px 18px;
                  display:flex;justify-content:space-between;align-items:center">
        <b>Code à coller dans js/${nomFichier}</b>
        <button id="fermer-modale-code"
                style="background:rgba(255,255,255,.2);border:none;color:#fff;
                       width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:16px">
          ✕
        </button>
      </div>
      <p style="padding:10px 18px 6px;font-size:13px;color:#555">
        Sélectionnez tout (Ctrl+A) puis copiez (Ctrl+C) dans la zone ci-dessous :
      </p>
      <textarea readonly
                style="flex:1;margin:0 18px 18px;padding:10px;font-family:monospace;
                       font-size:12px;border:1px solid #e8e0de;border-radius:8px;
                       resize:none;color:#7a1a0a;background:#fef6f4"
      >${escHtml(codeJS)}</textarea>
    </div>`;

  document.body.appendChild(zoneAffichage);
  zoneAffichage.querySelector('textarea').select();
  document.getElementById('fermer-modale-code').onclick = () =>
    document.body.removeChild(zoneAffichage);
}
