/**
 * admin.js — Vue Administration : tableau CRUD des questions.
 *
 * Responsabilité unique : afficher, rechercher et supprimer
 * les questions dans l'interface d'administration.
 */

import { getFiltered, deleteQuestion } from './store.js';
import { escHtml, escAttr, showToast } from './utils.js';
import { openModal } from './modal.js';

const FREQ_LABEL = { hot: '🔴 Fréq.', med: '🔵 Tech.', easy: '🟢 Gén.' };
const FREQ_CLS   = { hot: 'tag-hot', med: 'tag-med', easy: 'tag-easy' };

/** Initialise les listeners de la vue admin. */
export function initAdmin() {
  document.getElementById('a-proj').addEventListener('change', renderAdmin);
  document.getElementById('a-search').addEventListener('input', renderAdmin);
}

/** Rend le tableau des questions avec les filtres actifs. */
export function renderAdmin() {
  const fProj  = document.getElementById('a-proj').value;
  const search = document.getElementById('a-search').value;

  const filtered = getFiltered({ proj: fProj || undefined, search });

  if (!filtered.length) {
    document.getElementById('a-table-wrap').innerHTML =
      `<div class="empty"><div class="empty-icon">📭</div><p>Aucune question.</p></div>`;
    return;
  }

  const rows = filtered.map(buildRow).join('');

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
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p style="font-size:12px;color:#aaa;margin-top:8px;text-align:right">
      ${filtered.length} question(s)
    </p>
  `;
}

/**
 * Construit une ligne <tr> pour une question.
 * @param {Object} q
 * @returns {string}
 */
function buildRow(q) {
  const projBadge = q.proj === 'p1'
    ? `<span class="proj-badge badge-p1">P1</span>`
    : `<span class="proj-badge badge-p2">P2</span>`;

  const freqBadge = `<span class="tag ${FREQ_CLS[q.freq] || 'tag-easy'}" style="margin:0">
    ${FREQ_LABEL[q.freq] || ''}
  </span>`;

  const them = q.thematique
    ? `<span class="thematique-badge">${escHtml(q.thematique)}</span>`
    : '—';

  // On passe l'id via data-attribute pour éviter les problèmes d'apostrophes
  return `
    <tr>
      <td>${projBadge}</td>
      <td class="qtxt-cell" title="${escAttr(q.question)}">${q.question}</td>
      <td>${escHtml(q.category || '')}</td>
      <td>${them}</td>
      <td>${freqBadge}</td>
      <td>
        <div class="actions">
          <button class="btn btn-secondary btn-sm"
                  data-id="${escAttr(q.id)}"
                  onclick="App.editQuestion(this.dataset.id)">✏️</button>
          <button class="btn btn-danger btn-sm"
                  data-id="${escAttr(q.id)}"
                  onclick="App.confirmDelete(this.dataset.id)">🗑</button>
        </div>
      </td>
    </tr>`;
}

/**
 * Ouvre le modal d'édition pour une question.
 * @param {string} id
 */
export function editQuestion(id) {
  openModal(id);
}

/**
 * Demande confirmation puis supprime une question.
 * @param {string} id
 */
export function confirmDelete(id) {
  if (!confirm('Supprimer cette question définitivement ?')) return;
  const ok = deleteQuestion(id);
  showToast(ok ? '🗑 Question supprimée.' : '❌ Question introuvable.');
  renderAdmin();
}
